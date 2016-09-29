import React, {} from 'react';

import {bindActionCreators} from 'redux';

import { connect, } from 'react-redux';

import Modal from 'react-bootstrap/lib/Modal';

import { graphql, compose, } from 'react-apollo';
import gql from 'graphql-tag';

import { login as reloadAccount, } from 'redux/reducers/user/actions';

import selector from './selector';

import Dialog from 'containers/ModalContainer/Dialog';

import CSSModules from 'react-css-modules';

import styles from './Account.scss';

import ModalContainer from 'containers/ModalContainer';

function load(cb){
  require.ensure([], function (require) {
    const { default : Component, } = require('./Account');
    cb(Component);
  }, 'Account');
}

class AccountLoad extends React.PureComponent{
  state = {
    Component: null,
  };
  componentWillReceiveProps(nextProps){
    const { id, modalOpen, } = nextProps;
    if(id !== this.props.id || modalOpen !== this.props.modalOpen){
      if(modalOpen){
        load((Component) => {
          this.setState({
            Component: compose(
              withUpdateProfileMutation,
              withChangePasswordMutation
            )(Component),
          });
        });
      } else {
        this.setState({
          Component: null,
        });
      }
    }
  }
  render(){
    const { Component } = this.state;
    const { styles : theme, modalOpen, ...props, } = this.props;
    return (
      <Modal dialogClassName={theme.modal}
             dialogComponentClass={Dialog}
             show={modalOpen} keyboard={false} backdrop={false} onHide={props.actions.onClose} autoFocus enforceFocus>

        {Component && <Component theme={theme} {...props}/>}

       </Modal>
    );
  }
}

function mapStateToProps(state, props){
  return selector(state, props);
}
function mapDispatchToProps(dispatch, props){
  return {
    actions: {
      ...props.actions,
      ...bindActionCreators({
        reloadAccount,
      }, dispatch),
    },
  };
}

AccountLoad = connect(mapStateToProps, mapDispatchToProps)(
  CSSModules(AccountLoad, styles)
);

const CHANGE_PASSWORD_MUTATION = gql`

  mutation changePassword($newPassword: String!){
    changePassword(newPassword: $newPassword)
  }

`

const withChangePasswordMutation = graphql(CHANGE_PASSWORD_MUTATION, {
  props: ({ ownProps, mutate, }) => {
    return {
      changePassword({ newPassword, }) {
        return mutate({
          variables: { newPassword, },
        });
      }
    };
  },
});

const UPDATE_PROFILE_MUTATION = gql`

  mutation updateProfile($fields: [FieldValueType!]!){
    updateProfile(fields: $fields)
  }

`

const withUpdateProfileMutation = graphql(UPDATE_PROFILE_MUTATION, {
  props: ({ ownProps, mutate, }) => {
    return {
      updateProfile({ fields, }) {
        return mutate({
          variables: { fields, },
        });
      }
    };
  },
});

export default ModalContainer.create('account', function(props){
  return (
    <AccountLoad {...props}/>
  );
});
