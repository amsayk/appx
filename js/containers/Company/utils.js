import React, {} from 'react';

import cx from 'classnames';

import Parse from 'parse';

import Logo from './Logo';

import { createValidator, required, email, url, } from 'utils/validation';

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

export const renderSelectField = ({ input, name, options, label, placeholder, required = false, autoFocus = false, disabled = false, meta: { touched, error } }) => (
  <fieldset disabled={disabled} className={cx('form-group', { 'has-danger': touched && error, })}>
    {label && <label htmlFor={name} className={''} style={{ paddingLeft: 0,  }}>
      {label}
      {required && <span className={'required'}>*</span>}
    </label>}
    <select placeholder={placeholder} autoFocus={autoFocus} name={name} className={cx('form-control', { 'form-control-danger': touched && error,  })} {...input}>
      {options.map(({ value, displayName, ...props, }) => (
        <option value={value} {...props}>{displayName}</option>
      ))}
    </select>
    {touched && error && <small className={'text-muted'} style={{ marginTop: 3, display: 'block', height: 15, }}>
      <div className='text-danger'>{error}</div>
    </small>}
  </fieldset>
);

export const renderLogoField = ({ input }) => (
  <fieldset className={cx('form-group')}>
    <Logo {...input}/>
  </fieldset>
);

export const validate = createValidator({
  displayName: [required],
  email: [email],
  webSite: [url],
});

export function asyncValidate(values) {
  const displayName = values.get('displayName');
  if (!displayName) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    const query = new Parse.Query(Company);
    query.equalTo('displayNameLowerCase', makeAlias(displayName));

    const objectId = values.get('objectId');

    objectId && query.notEqualTo('objectId', objectId);

    query.first().then(
      function (object) {
        if (object) {
          resolve({
            displayName: 'Ce nom de société a déjà été utilisée.',
          });
          return;
        }

        resolve({});
      },

      function () {
        resolve({
          displayName: 'Erreur inconnu. Veuillez rafraîchir la page.',
        });
      }
    );
  });
}
