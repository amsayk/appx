import React, {PropTypes} from 'react';

import Parse from 'parse';

import cookie from 'react-cookie';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import CSSModules from 'react-css-modules';

import selector from './selector';

import { login } from 'redux/reducers/user/actions';

import { replace } from 'react-router-redux';

import validation from './validation';

import Immutable from 'immutable';

import cx from 'classnames';

import styles from './Login.scss';

import Title from 'components/Title';

import isEmpty from 'lodash.isempty';

import { SubmissionError, Field, reduxForm } from 'redux-form/immutable';

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

class Login extends React.Component {

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  constructor(...args) {
    super(...args);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { isAuthenticated, actions: { replace }, redirect } = this.props;
    if (isAuthenticated) {
      replace(redirect);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, actions: { replace }, redirect } = nextProps;
    const { isAuthenticated: wasAuthenticated } = this.props;

    if (!wasAuthenticated && isAuthenticated) {
      replace(redirect);
    }
  }

  onSubmit(credentials) {
    const self = this;

    const {email, password} = credentials.toJS();

    return Parse.User.logIn(
      email, /*password = */isEmpty(password) && process.env.NODE_ENV !== 'production' ? process.env.DEFAULT_PASSWORD : password).then(function(parseObject){

        if(parseObject){

          const user = parseObject.toJSON();

          cookie.save('app.login', email);

          self.props.actions.login(user);
        } else {
          throw new SubmissionError({ _error: 'Login failed!' });
        }

      }, function () {
        throw new SubmissionError({ _error: 'Login failed!' });
      });

  }

  _renderForm = () => {
    const {intl,} = this.context;

    const {
      error, handleSubmit, pristine, submitting
    } = this.props;

    return (
      <div styleName='login'>

        <i className='material-icons md-dark md-inactive' style={{fontSize: 80}}>account_balance_wallet</i>

        <form styleName='form' onSubmit={handleSubmit(this.onSubmit)}>

          <div styleName='header'>{intl.formatMessage(messages.title)}</div>

          <label styleName='row'>

            <div styleName='label'>{intl.formatMessage(messages.email)}</div>

            <div styleName='input' className={'ha-text-field'}>

              <Field
                name='email'
                component={'input'}
                type='text'
                autoFocus
              />

            </div>

          </label>

          <label styleName='row' className={'ha-text-field'}>

            <div styleName='label'>{intl.formatMessage(messages.password)}</div>

            <div styleName='input'>

              <Field
                name='password'
                component='input'
                type='password'
              />

            </div>

          </label>

          <div styleName={cx('footer', {error: error,})}>
            {/* <div styleName='verticalCenter' style={{ width:'100%' }}>
             <a onClick={this._onForgot}>{formatMessage(messages.forgot)}</a>
             </div>*/}

            {error && !submitting ?
              <span>{intl.formatMessage(messages.error)}</span>
              : null}

          </div>

          <button disabled={submitting} type='submit' styleName='submit'>
            <span>{submitting ? <i styleName={'busy'}
                                           className={`material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['logIn'])}</span>
          </button>

        </form>

      </div>
    );
  };

  render() {
    const {formatMessage,} = this.context.intl;
    return (
      <div className='index' style={{ display: 'flex', flex: 1, background: '#06283d'}}>
        <Title title={formatMessage(messages.Login)}/>
        {this._renderForm()}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({login, replace}, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
  form: 'login',
  validate: validation,
})(CSSModules(Login, styles, {
  allowMultiple: true
})));
