import React, {} from 'react';

import ModalContainer from 'containers/ModalContainer';

import Modal from 'react-bootstrap/lib/Modal';

import { graphql, compose, } from 'react-apollo';
import gql from 'graphql-tag';

import Dialog, { Header, Body, Footer } from 'containers/ModalContainer/Dialog';

import CSSModules from 'react-css-modules';

import styles from './Company.scss';

import update from 'react-addons-update';

import find from 'lodash.findindex';

function load(cb){
  require.ensure([], function(require){
    const { default : Component, } = require('./Company');
    cb(Component);
  }, 'Company');
}

class CompanyLoad extends React.PureComponent{
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
              withQuery,
              withMutations
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

CompanyLoad = CSSModules(CompanyLoad, styles);

const QUERY = gql`

  query getCompany($id: ID!){

    company(id: $id){
      objectId
      displayName

      legalForm
      activity
      email
      fax
      webSite

      streetAddress
      cityTown
      stateProvince
      postalCode
      country

      ice
      rc
      patente
      cnss
      banque
      rib

      createdAt
      updatedAt
    }

  }

`;

const MUTATION = gql`

  mutation addOrUpdateCompany($id: ID, $fields: [FieldValueType!]!, $logo: FileItemInput){
    addOrUpdateCompany(id: $id, fields: $fields, logo: $logo) {
      company{
        objectId
        displayName

        legalForm
        activity
        email
        fax
        webSite

        streetAddress
        cityTown
        stateProvince
        postalCode
        country

        ice
        rc
        patente
        cnss
        banque
        rib

        createdAt
        updatedAt
      }
    }
  }

`;

const withMutations = graphql(MUTATION, {
  props: ({ ownProps, mutate, }) => {
    return {
      submit({ fields, logo, }) {
        return mutate({
          variables: { id: ownProps.id, fields, logo },
          updateQueries: {

            getCompany: (previousQueryResult, { mutationResult }) => {
              const company = mutationResult.data.addOrUpdateCompany.company;
              return update(previousQueryResult, {
                company: {
                  $set: company,
                },
              });
            },

            getCompanies: (previousQueryResult, { mutationResult }) => {
              const company = mutationResult.data.addOrUpdateCompany.company;

              const index = find(previousQueryResult.companies, (f) => f.objectId == company.objectId);

              if (index !== -1) {
                return update(

                  update(
                    previousQueryResult,
                    {
                      companies: {
                        $splice: [ [ index, 1 ] ]
                      }
                    }
                  ),

                  {
                    companies: {
                      $push: [ company ]
                    }
                  }
                );
              }

              return update(previousQueryResult, {
                companies: {
                  $push: [ company ],
                },
              });
            },

          },
        });
      }
    };
  },
});

const withQuery = graphql(QUERY, {
  options: (ownProps) => ({
    variables: { id: ownProps.id },
    skip: typeof ownProps.id === 'undefined',
  }),
  props: ({ ownProps, data }) => {
    if (data.loading) return { loading: true, hasErrors: false, };
    if (data.errors || data.error) return { hasErrors: true, loading: false };

    return {
      initialValues: data.company || {},
      loading: false,
      hasErrors: false,
    };
  },
});

export default ModalContainer.create('company', function(props){
  return (
    <CompanyLoad {...props}/>
  );
});
