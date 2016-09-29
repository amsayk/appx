import React, {} from 'react';

import { createValidator, required, } from 'utils/validation';

import Parse from 'parse';

import makeAlias from 'utils/makeAlias';

import {Form,} from 'utils/types';

import cx from 'classnames';

import striptags from 'striptags';

import InputEditable from 'react-contenteditable';

export function normalizeDisplayName(value){
  return striptags(value).replace(/&nbsp;/g, '');
}

export const renderEditableField = ({ input, defaultValue, id, theme, meta: { touched, error } }) => {

  return (
  <span id={id} className={cx('form-group', { 'has-danger': touched && error, })}>
    <InputEditable
      tagName={'span'}
      html={input.value || defaultValue}
      onChange={input.onChange}
      disabled={false}
      onKeyPress={(evt) => {
        if(evt.nativeEvent.keyCode === 13) {
          evt.preventDefault();
          evt.target.blur();
        }
      }}
    />
  </span>
);
};

export const valdate = (type) => {

  switch(type){
    case 'CNSS': {

      return createValidator({
        displayName: [ required, ],
      });
    }
    case 'IR': {

      return createValidator({
        displayName: [ required, ],
      });
    }
    case 'IS': {

      return createValidator({
        displayName: [ required, ],
      });
    }
    case 'VAT': {

      return createValidator({
        displayName: [ required, ],
      });
    }
  }
}

export const aysncValdate = (type) => {

  switch(type){
    case 'CNSS': {

      return (values, dispatch) => {
        return Promise.resolve({});
      };
    }
    case 'IR': {

      return (values, dispatch) => {
        return Promise.resolve({});
      };
    }
    case 'IS': {

      return (values, dispatch) => {
        return Promise.resolve({});
      };
    }
    case 'VAT': {

      return (values, dispatch) => {
        return Promise.resolve({});
      };
    }


  }
}

export const renderLabel = ({ input, defaultValue, }) => (
  <span>
    {input.value || defaultValue}
  </span>
);

