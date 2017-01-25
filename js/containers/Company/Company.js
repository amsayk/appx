import React, {} from 'react';

import { selectCompany } from 'redux/reducers/sidebar/actions';

import { Header, Footer, Body } from 'containers/ModalContainer/Dialog';

import Loading from 'components/Loading';

import TopBar from 'components/TopBar';
import BottomBar from 'components/Form/BottomBar';

import { Field, propTypes, reduxForm, SubmissionError } from 'redux-form/immutable';

import {
  Section,
  renderField,
  renderLabel,
  renderInlineField,
  renderTextAreaField,
  renderSelectField,
  renderLogoField,
  validate,
  asyncValidate,
} from './utils';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from 'utils/unbeforeunload';

import emptyFunction from 'utils/emptyFunction';

import Actions from 'components/confirm/actions';

const CONFIRM_MSG = 'Êtes-vous sur de vouloir quitter sans enregistrer les modifications ??';

const LEGAL_FORMS = [{
  value: '',
  displayName: '-- Choisir la forme juridique --',
}, {
  value: 'SARL',
  displayName: 'S.A.R.L'
}, {
  value: 'SA',
  displayName: 'SA'
}, {
  value: 'SNC',
  displayName: 'SNC',
}, {
  value: 'SARL_AU',
  displayName: 'S.A.R.L (AU)',
}];

const ALLOW_FIELDS = [
  'displayName',
  'legalForm',
  'activity',
  'email',
  'fax',
  'webSite',

  'streetAddress',
  'cityTown',
  'stateProvince',
  'postalCode',
  'country',

  'ice',
  'rc',
  'patente',
  'cnss',
  'banque',
  'rib'
];

class Company extends React.PureComponent {

  static propsTypes = {
    ...propTypes,
    actions: React.PropTypes.shape({
      onClose: React.PropTypes.func.isRequired,
      refresh: React.PropTypes.func.isRequired,
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
  }
  constructor(...args){
    super(...args);

    this.onSubmit = this.onSubmit.bind(this);
    this.onClose = this.onClose.bind(this);
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
  onClose(){
    const { destroy, actions: { onClose : close, }, dirty } = this.props;
    if(dirty){
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
  onSubmit(data){
    const self = this;
    const { id, doMutationAction : submit, actions: { refresh }, } = this.props;
    return Promise.resolve().then(function () {
      const fields = data.reduce((result, value, key) => {
        switch (key) {
          case 'logo':

            break;
          default:

            (ALLOW_FIELDS.indexOf(key) !== -1) && result.push({
              fieldName: key,
              value,
            });

        }

        return result;
      }, []);

      return submit({ fields, }).then(function(result) {
        self.context.notificationMgr.notify({ message: 'Enregistrer avec succès!', });
        id || function (){
          const company = result.data.addOrUpdateCompany.company;
          refresh(company.id);
        }();
        id || function () {
          const company = result.data.addOrUpdateCompany.company;
          self.context.store.dispatch(
              selectCompany(company.id));
        }();
      }, function () {
        self.context.notificationMgr.notify({ message: 'Erreur! Veuillez essayer encore 😬.', type: 'danger', });
      });
    });
  }
  render() {
    const {
      id,
      loading,
      hasErrors,
      error,
      theme,
      handleSubmit,
      submitting,
      pristine,
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
        name='displayName'
        component={renderLabel}
        defaultValue={'Nouvelle société'}
      />
    );

    return (
      <div data-fragment>

          <Header>
            <TopBar uppercase icon={ 'N' } title={ displayName }/>
          </Header>

          <Body>

            <Section icon={'info_outline'} title={'Information générale'} theme={theme}>

              <div style={{ display: 'flex', }}>

                <div style={{ width: 700, maxWidth: 700, marginRight: 100, borderRight: '1px solid #eee', paddingRight: 50, }} className={theme.Left}>

                  <Field
                    name='displayName'
                    type='text'
                    component={renderField}
                    label='Raison sociale'
                    required
                    autoFocus
                  />

                  <Field
                    name='legalForm'
                    type='select'
                    options={LEGAL_FORMS}
                    component={renderSelectField}
                    label='Forme juridique'
                  />

                  <Field
                    name='activity'
                    type='text'
                    component={renderField}
                    label='Activités'
                  />

                  <Field
                    name='email'
                    type='text'
                    component={renderField}
                    label='Courrier électronique'
                  />

                  <Field
                    name='fax'
                    type='text'
                    component={renderField}
                    label='Télécopie'
                  />

                  <Field
                    name='webSite'
                    type='text'
                    component={renderField}
                    label='Site WEB'
                  />

                </div>

                <div className={theme.Right}>

                  <Field
                    name='logo'
                    component={renderLogoField}
                  />

                </div>

              </div>

            </Section>

            <Section icon={'location_on'} title={'Adresse'} theme={theme}>

              <div style={{ display: 'flex', flexDirection: 'column', }}>

                  <div>

                    <Field
                      name='streetAddress'
                      component={renderTextAreaField}
                      placeholder='Rue'
                    />

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', }}>

                    <div style={{ flex: 1, marginRight: 12, }}>

                      <Field
                        name='cityTown'
                        type='text'
                        component={renderField}
                        placeholder='Ville'
                      />

                    </div>

                    <div style={{ flex: 1, }}>

                      <Field
                        name='stateProvince'
                        type='text'
                        component={renderField}
                        placeholder='Province'
                      />

                    </div>

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', }}>

                    <div style={{ flex: 1, marginRight: 12, }}>

                      <Field
                        name='postalCode'
                        type='text'
                        component={renderField}
                        placeholder='Code postale'
                      />

                    </div>

                    <div style={{ flex: 1, }}>

                      <Field
                        name='country'
                        type='text'
                        component={renderField}
                        placeholder='Pays'
                      />

                    </div>

                  </div>

              </div>

            </Section>

            <Section icon={'receipt'} title={'Numéros d\'identification de l\'entreprise'} theme={theme}>

              <Field
                name='ice'
                component={renderInlineField}
                label={'ICE'}
              />
              <Field
                name='rc'
                component={renderInlineField}
                label={'RC'}
              />
              <Field
                name='patente'
                component={renderInlineField}
                label={'Patente'}
              />
              <Field
                name='cnss'
                component={renderInlineField}
                label={'CNSS'}
              />
              <Field
                name='banque'
                component={renderInlineField}
                label={'Banque'}
              />
              <Field
                name='rib'
                component={renderInlineField}
                label={'RIB Bancaire'}
              />

            </Section>

            <br/>
            <br/>

          </Body>

          <Footer>
            <BottomBar
              submitting={submitting}
              pristine={pristine}
              onCancel={this.onClose}
              cancelLabel={ id && pristine ? 'Fermer' : 'Annuler' }
              onSaveOnly={handleSubmit(this.onSubmit)}
            />
          </Footer>

        </div>
    );
  }
}

export default reduxForm({
  form:  'company',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'displayName' ],
  destroyOnUnmount: false,
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
})(Company);
