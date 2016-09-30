import React, {} from 'react';

import Modal from 'react-bootstrap/lib/Modal';

import memoize from 'lru-memoize';

import isEqual from 'lodash.isequal';

import { Header, Body, Footer } from 'containers/ModalContainer/Dialog';

import TopBar from 'components/TopBar';
import BottomBar from 'components/Form/BottomBar';

import Loading from 'components/Loading';

import {
  validate,
  asyncValidate,
  renderLabel,
  renderEditableField,
  normalizeDisplayName,
} from './utils';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from 'utils/unbeforeunload';

import emptyFunction from 'utils/emptyFunction';

import Actions from 'components/confirm/actions';

import { Field, reduxForm, propTypes, SubmissionError, } from 'redux-form/immutable';

const CONFIRM_MSG = 'Êtes-vous sur de vouloir quitter sans enregistrer les modifications ??';

const CONFIRM_DELETE_MSG = 'Êtes-vous sur de vouloir supprimer cette formulaire ??';

const FormWrapper = ({ name, title, designation }) => class extends React.PureComponent{
  static displayName = `Form(${name})`;
  static propTypes = {
    actions: React.PropTypes.shape({
      onClose: React.PropTypes.func.isRequired,
      refresh: React.PropTypes.func.isRequired,
      openModal: React.PropTypes.func.isRequired,
    }).isRequired,

  };
  static contextTypes = {
    notificationMgr: React.PropTypes.shape({
      notify: React.PropTypes.func.isRequired,
      dismiss: React.PropTypes.func.isRequired,
    }).isRequired,

    store: React.PropTypes.shape({
      dispatch: React.PropTypes.func.isRequired,
    }).isRequired,

    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  }
  componentDidMount(){
    const { joyride } = this.context;

    const steps = [{
      id: `form-${name}-1`,
      text: 'Changer ce titre en cliquant ici.',
      selector: `#displayName-field-${name}`,
      position: 'bottom',
      type: 'hover',
    }];

    setTimeout(function () {
      joyride.addSteps(steps);
    }, 500);

  }

  constructor(...args){
    super(...args);

    this.onSaveOnly = this.onSubmit.bind(this, false);
    this.onSaveAndClose = this.onSubmit.bind(this, true);
    this.onPrint = this.onPrint.bind(this);

    this.onClose = this.onClose.bind(this);

    this.actions = [{
      id: 1,
      title: 'Supprimer',
      onSelect: this.onAction.bind(this, 1),
    }, {
      id: 2,
      title: 'Dupliquer',
      onSelect: this.onAction.bind(this, 2),
    }];
  }
  componentDidUpdate() {
    const {
      dirty,
    } = this.props;

    setBeforeUnloadMessage(
      dirty ? CONFIRM_MSG : null
    );
  }
  componentWillUnmount() {
    unsetBeforeUnloadMessage();
  }
  onClose(confirm = true){
    const { destroy, actions: { onClose : close, }, dirty } = this.props;
    if(dirty && confirm){
      return Actions.show(CONFIRM_MSG)
        .then(function () {
          destroy();
          close();
        })
        .catch(emptyFunction);
    }
    destroy();
    close();
  }
  onAction(key){
    const self = this;
    const { actions, handleSubmit, form, del, type, company } = this.props;

    function onDelete(){
      const p = Actions.show(CONFIRM_DELETE_MSG)
        .then(function () {
           return del().then(
             function () {
               self.context.notificationMgr.notify({ message: 'Succès!' });
               self.onClose(false);
             },
             function () {
               self.context.notificationMgr.notify({ message: 'Erreur! Veuillez essayer encore 😬.', type: 'danger' });
             }
           );
        })
        .catch(emptyFunction);
      return handleSubmit(p);
    }

    function onDuplicate(){
      self.onClose();
      setTimeout(
        function () {
          actions.openModal('form', { type, company, initialValues: { displayName: form.displayName } });
        },
        200
      );
    }

    switch(key){
      case 1: return onDelete();
      case 2: return onDuplicate();
    }

  }
  onPrint(){
    const { actions, getPdf, initialValues, } = this.props;

    actions.openModal('pdfViewer', {
      getPdf: () => getPdf(form.id).then((result) => result.data.getFormPdf.url),
      title: initialValues.get('displayName'),
    });
  }
  onSubmit(close, data){
    const self = this;
    const { id, addOrUpdate, actions: { refresh } } = this.props;
    return Promise.resolve().then(function () {
      const fields = data.reduce((result, value, key) => {
        switch (key) {
          default:
            result.push({
              fieldName: key,
              value,
            });
        }
        return result;
      }, []);

      return addOrUpdate({ fields }).then(function (result) {
        self.context.notificationMgr.notify({ message: 'Enregistrer avec succès!' });
        id || function () {
          const form = result.data.addOrUpdateForm.form;
          refresh(form.id);
        }();

        if(close){
          self.onClose(false);
        }
      }, function () {
        self.context.notificationMgr.notify({ message: 'Erreur! Veuillez essayer encore 😬.', type: 'danger' });
      });
    });
  }
  render(){
    const {
      theme,
      id,
      loading,
      hasErrors,
      error,
      actions,
      handleSubmit,
      type,
    } = this.props;

    if(loading){
      return (
        <div style={{ display: 'flex', flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center', }}>
          <Loading/>
        </div>
      );
    }

    const isError = hasErrors || error;

    const displayName = (
      <Field
        id={`displayName-field-${type}`}
        name='displayName'
        normalize={normalizeDisplayName}
        component={renderEditableField}
        theme={theme}
        defaultValue={title}
      />
    );

    return (
      <div data-fragment>

        <Header>

          <TopBar uppercase icon={designation} title={ displayName }/>

        </Header>

        <Body>

          {this.props.children}

        </Body>

        <Footer>

          <BottomBar
            id={id}
            onCancel={this.onClose}
            cancelLabel={id && 'Fermer'}
            onSaveOnly={handleSubmit(this.onSaveOnly)}
            onSaveAndClose={handleSubmit(this.onSaveAndClose)}
            onPrint={this.onPrint}
            actions={this.actions}
          />

        </Footer>

      </div>
    );
  }
}


export default memoize(4)(function ({ name, title, designation }) {

  const form = reduxForm({
    form:  `form.${name}`,
    validate,
    asyncValidate,
    asyncBlurFields: [],
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: false,
  });

  const Component = FormWrapper({ name, title, designation });

  return form(Component);
}, isEqual);
