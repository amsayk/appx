import React, {} from 'react';

import cx from 'classnames';

import Parse from 'parse';

import { createValidator, email as isValidEmail, } from 'utils/validation';

import makeAlias from 'utils/makeAlias';

import {Company,} from 'utils/types';

export class Section extends React.PureComponent{
  render(){
    const { theme, title, icon, children, } = this.props;
    return (
      <div className={theme.section}>

        <header className={theme.sectionTitle}>
          <i style={{ display: 'inline-block', }} className={'material-icons'}>{icon}</i>{' '}
          <h3 style={{ display: 'inline-block', }}>{title}</h3>
        </header>

        <div className={theme.sectionBody}>

          {children}

        </div>

      </div>

    );
  }
}

export const renderLabel = ({ input, defaultValue, }) => (
  <span>
    {input.value || defaultValue}
  </span>
);

export const renderField = ({ input, name, label, placeholder, type, required = false, autoFocus = false, disabled = false, meta: { touched, error } }) => (
  <fieldset disabled={disabled} className={cx('form-group', { 'has-danger': touched && error, })}>
    {label && <label htmlFor={name} className={''} style={{ paddingLeft: 0,  }}>
      {label}
      {required && <span className={'required'}>*</span>}
    </label>}
    <input placeholder={placeholder} autoFocus={autoFocus} name={name} type={type} className={cx('form-control', { 'form-control-danger': touched && error,  })} {...input}/>
    {touched && error && <small className={'text-muted'} style={{ marginTop: 3, display: 'block', height: 15, }}>
      <div className='text-danger'>{error}</div>
    </small>}
  </fieldset>
);

export const renderInlineField = ({ input, name, label, placeholder, type, required = false, autoFocus = false, disabled = false, meta: { touched, error } }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', }} className={cx('form-group', { 'has-danger': touched && error, })}>
    {label && <label htmlFor={name} className={''} style={{ paddingLeft: 0, flex: 0.25,  }}>
      {label}
      {required && <span className={'required'}>*</span>}
    </label>}
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, }}>
      <input disabled={disabled} placeholder={placeholder} autoFocus={autoFocus} name={name} type={type} className={cx('form-control', { 'form-control-danger': touched && error,  })} {...input}/>
      {touched && error && <small className={'text-muted'} style={{ marginTop: 3, display: 'block', height: 15, }}>
        <div className='text-danger'>{error}</div>
      </small>}
    </div>
  </div>
);

export const renderTextAreaField = ({ input, name, label, placeholder, required = false, autoFocus = false, disabled = false, meta: { touched, error } }) => (
  <fieldset disabled={disabled} className={cx('form-group', { 'has-danger': touched && error, })}>
    {label && <label htmlFor={name} className={''} style={{ paddingLeft: 0,  }}>
      {label}
      {required && <span className={'required'}>*</span>}
    </label>}
    <textarea placeholder={placeholder} autoFocus={autoFocus} name={name} className={cx('form-control', { 'form-control-danger': touched && error,  })} {...input}/>
    {touched && error && <small className={'text-muted'} style={{ marginTop: 3, display: 'block', height: 15, }}>
      <div className='text-danger'>{error}</div>
    </small>}
  </fieldset>
);

export function asyncValidateProfile(values) {
  const email = values.get('email');
  if (! email) {
    return Promise.resolve({
      email: 'Ce champ est nécessaire.',
    });
  }

  const emailErrorMessage = isValidEmail(email);
  if(typeof emailErrorMessage !== 'undefined'){
    return Promise.resolve({
      email: emailErrorMessage,
    });
  }

  const displayName = values.get('displayName');
  if (! displayName) {
    return Promise.resolve({
      displayName: 'Ce champ est nécessaire.',
    });
  }
  return new Promise((resolve, reject) => {
    const id = values.get('id');

    // Email
    const emailQ = new Parse.Query(Parse.User);
    emailQ.equalTo('email', email);

    id && emailQ.notEqualTo('objectId', id);

    // Username
    const usernameQ = new Parse.Query(Parse.User);
    usernameQ.equalTo('username', email);

    id && usernameQ.notEqualTo('objectId', id);

    const query = Parse.Query.or(
      emailQ,
      usernameQ
    );

    query.first().then(
      function (object) {
        if (object) {
          resolve({
            email: 'Ce nom d\'utilisateur a déjà été utilisée.',
          });
          return;
        }

        resolve({});
      },

      function () {
        resolve({
          email: 'Erreur inconnu. Veuillez rafraîchir la page.',
        });
      }
    );
  });
}

export function asyncValidateCurrentPassword(values) {
  const currentPassword = values.get('currentPassword');
  if (! currentPassword) {
    return Promise.resolve({
      currentPassword: 'Ce champ est nécessaire.',
    });
  }

  const newPassword = values.get('newPassword');
  if (! newPassword) {
    return Promise.resolve({
      newPassword: 'Ce champ est nécessaire.',
    });
  }

  const newPasswordConfirmation = values.get('newPasswordConfirmation');
  if (! newPasswordConfirmation) {
    return Promise.resolve({
      newPasswordConfirmation: 'Ce champ est nécessaire.',
    });
  }else if(newPasswordConfirmation !== newPassword){
    return Promise.resolve({
      newPasswordConfirmation: 'Les mots de passe ne correspond pas.',
    });
  }
  return new Promise((resolve) => {
    Parse.User.logIn(values.get('email'), currentPassword).then(
      function(){
        resolve({});
      },
      function () {
        resolve({
          currentPassword: 'Votre mot de passe est incorrecte.',
        });
      }
    )
  });
}
