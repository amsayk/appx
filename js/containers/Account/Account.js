import React, {} from 'react';

import getCurrentUser from 'utils/getCurrentUser';

import { Header, Body, Footer } from 'containers/ModalContainer/Dialog';

import TopBar from 'components/TopBar';
import BottomBar from 'components/Form/BottomBar';

import { Field, propTypes, reduxForm, SubmissionError, destroy, } from 'redux-form/immutable';

import {
  Section,
  renderField,
  renderLabel,
  renderInlineField,
  renderTextAreaField,
  asyncValidateProfile,
  asyncValidateCurrentPassword,
} from './utils';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from 'utils/unbeforeunload';

import emptyFunction from 'utils/emptyFunction';

import Actions from 'components/confirm/actions';

const CONFIRM_MSG = 'Êtes-vous sur de vouloir quitter sans enregistrer les modifications ??';

export default class Account extends React.PureComponent{
  static propTypes = {
    actions: React.PropTypes.shape({
      onClose: React.PropTypes.func.isRequired
    }).isRequired,

  };
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  }
  constructor(...args){
    super(...args);

    this.onClose = this.onClose.bind(this);
  }
  componentWillUnmount() {
    unsetBeforeUnloadMessage();
  }
  onClose(){
    const self = this;
    const { actions: { onClose : close, } } = this.props;

    const dirty = this.refs.password.dirty || this.refs.profile.dirty;
    if(dirty){
      return Actions.show(CONFIRM_MSG)
        .then(function () {
          self.context.store.dispatch([
            destroy('account.profile'),
            destroy('account.password')
          ]);
          close();
        })
        .catch(emptyFunction);
    }
    self.context.store.dispatch([
      destroy('account.profile'),
      destroy('account.password')
    ]);
    close();
  }
  render(){
    const {
      theme,
      user,
      updateProfile,
      changePassword,
      actions,
    } = this.props;
    return (
      <div data-fragment>

        <Header>
          <TopBar uppercase icon={ 'A' } title={ 'Mon compte' }/>
        </Header>

        <Body>

          <Profile
            ref={'profile'}
            theme={theme}
            reloadAccount={actions.reloadAccount}
            updateProfile={updateProfile}
            initialValues={{ id: user.id, email: user.email, displayName: user.displayName, }}
          />

        <br/>
        <hr/>
        <br/>

        <Password
          ref={'password'}
          theme={theme}
          reloadAccount={actions.reloadAccount}
          changePassword={changePassword}
          initialValues={{ email: user.username, }}
        />

      <br/>
      <br/>

    </Body>

    <Footer>

      <BottomBar
        onCancel={this.onClose}
        cancelLabel={ 'Fermer' }
      />

  </Footer>

</div>
    );
  }
}

const ALLOW_FIELDS = [
  'email',
  'displayName'
];

class Profile extends React.Component{
  static propTypes = {
    ...propTypes,
  }
  static contextTypes = {
    notificationMgr: React.PropTypes.shape({
      notify: React.PropTypes.func.isRequired,
      dismiss: React.PropTypes.func.isRequired,
    }).isRequired,
  }
  constructor(...args){
    super(...args);

    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate() {
    const {
      dirty,
    } = this.props;

    setBeforeUnloadMessage(
      dirty ? CONFIRM_MSG : null
    );
  }
  onSubmit(data){
    const self = this;
    const { updateProfile, reloadAccount, } = this.props;
    return Promise.resolve().then(function() {
      const fields = data.reduce((result, value, key) => {
        (ALLOW_FIELDS.indexOf(key) !== -1) && result.push({
          fieldName: key,
          value,
        });

        return result;
      }, []);

      return updateProfile({ fields, }).then(function(result) {
        return getCurrentUser().fetch().then(function(user){
          return reloadAccount(user.toJSON());
        });
      }).then(function() {
        self.context.notificationMgr.notify({ message: 'Succès!', });
      }, function() {
        self.context.notificationMgr.notify({ message: 'Erreur! Veuillez essayer encore 😬.', type: 'danger', });
      });
    });
  }
  render(){
    const { theme, pristine, error, submitting, handleSubmit, } = this.props;
    return (
      <Section icon={'account_circle'} title={'Profile'} theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', }}>

          <Field
            name='displayName'
            type='text'
            component={renderField}
            label='Nom complet'
            autoFocus
          />

          <Field
            name='email'
            type='text'
            component={renderField}
            label='Courrier electronique'
          />

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', }}>

          <button onClick={handleSubmit(this.onSubmit)} disabled={pristine || submitting} className={'btn btn-primary'}>
            Enregistrer
          </button>

        </div>

      </Section>
    );
  }
}

Profile = reduxForm({
  form: 'account.profile',
  asyncValidate: asyncValidateProfile,
  asyncBlurFields: [],
  destroyOnUnmount: false,
})(Profile);

class Password extends React.Component{
  static propTypes = {
    ...propTypes,
  }
  static contextTypes = {
    notificationMgr: React.PropTypes.shape({
      notify: React.PropTypes.func.isRequired,
      dismiss: React.PropTypes.func.isRequired,
    }).isRequired,
  }
  constructor(...args){
    super(...args);

    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidUpdate() {
    const {
      dirty,
    } = this.props;

    setBeforeUnloadMessage(
      dirty ? CONFIRM_MSG : null
    );
  }
  onSubmit(data){
    const self = this;
    const { changePassword, reloadAccount, reset } = this.props;
    return Promise.resolve()
    .then(function(){
      return changePassword({
        newPassword: data.get('newPassword'),
      }).then(function () {
        reset();
        return getCurrentUser().fetch().then(function (user) {
          reloadAccount(user.toJSON());
        });
      });
    }).then(function () {
      self.context.notificationMgr.notify({ message: 'Succès!' });
    }, function () {
      self.context.notificationMgr.notify({ message: 'Erreur! Veuillez essayer encore 😬.', type: 'danger', });
    });
  }
  render(){
    const { theme, pristine, error, submitting, handleSubmit, } = this.props;
    return (
      <Section icon={'lock'} title={'Mot de passe'} theme={theme}>

        <div style={{ display: 'flex', flexDirection: 'column', }}>

          <Field
            name='currentPassword'
            type='password'
            component={renderField}
            label='Mot de passe courant'
          />

          <br/>

          <Field
            name='newPassword'
            type='password'
            component={renderField}
            label='Nouvelle Mot de passe'
          />

          <Field
            name='newPasswordConfirmation'
            type='password'
            component={renderField}
            label='Confirmation'
          />

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', }}>

          <button onClick={handleSubmit(this.onSubmit)} disabled={pristine || submitting} className={'btn btn-danger'}>
            Enregistrer
          </button>

        </div>

      </Section>
    );
  }
}

Password = reduxForm({
  form: 'account.password',
  asyncValidate: asyncValidateCurrentPassword,
  asyncBlurFields: [],
  destroyOnUnmount: false,
})(Password);
