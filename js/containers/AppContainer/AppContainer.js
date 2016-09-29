import React, {} from 'react';

import {connect} from 'react-redux';

import { graphql, } from 'react-apollo';
import gql from 'graphql-tag';

import Sidebar from 'containers/Sidebar';
import Body from 'containers/Body';

import selector from './selector';

import ModalController from 'ModalController';

import {
  isServer,
} from 'utils/environment';


class AppContainer extends React.Component {
  static propTypes = {
    data: React.PropTypes.shape({
      loading: React.PropTypes.bool.isRequired,

      hasErrors: React.PropTypes.bool.isRequired,

      companies: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          objectId: React.PropTypes.string.isRequired,
          displayName: React.PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,

      currentUser: React.PropTypes.shape({
        objectId: React.PropTypes.string.isRequired,
        displayName: React.PropTypes.string.isRequired,
        email: React.PropTypes.string.isRequired,
      }).isRequired,

    }).isRequired,
  };
  componentDidMount(){
    if(! isServer) {
      ModalController.init();
    }
  }
  render() {
    const { data } = this.props;

    return (
      <div className={'root'}>

        <Sidebar
          currentUser={data.currentUser}
          hasErrors={!data.loading && data.hasErrors}
          companies={data.companies}
        />

        <Body {...data}/>

      </div>
    );
  }
}

const QUERY = gql`
  query getCompanies{

    companies{
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

const withData = graphql(QUERY, {
  options: (ownProps) => ({
    variables: {},
  }),
  props: ({ ownProps, data }) => {
    if (data.loading) return { data: { loading: true, hasErrors: false, currentUser: ownProps.user, companies: [], }};
    if (data.errors || data.error) return { data: { hasErrors: true, loading: false, currentUser: ownProps.user, companies: [], }};
    return { data: {
      companies: data.companies,
      currentUser: ownProps.user,
      loading: false,
      hasErrors: false,
    }};
  }
});

const AppContainerWithData = withData(AppContainer);

function mapStateToProps(state, props) {
  return selector(state, props);
}

export default connect(mapStateToProps)(AppContainerWithData);
