import React, {} from 'react';

import {connect} from 'react-redux';

import Loading from 'components/Loading';

import { open } from 'redux/reducers/modals/actions';

import selector from './selector';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import CSSModules from 'react-css-modules';

import Empty from './Empty';

import styles from './Body.scss';

import Fab from 'components/Fab';

import Heading from './Heading';

import Ops from './Ops';

class Body extends React.PureComponent {
  render() {
    const { styles : theme, actions, selectedCompanyId, } = this.props;
    return (
      <div style={{ height: '100vh', flex: 1 }}>

        {selectedCompanyId
          ? <CompanyLoad actions={actions} theme={theme} selectedCompanyId={selectedCompanyId}/>
          : <Empty/>}

          {selectedCompanyId && <Fab
            selectedCompanyId={selectedCompanyId}
            main={{
              iconResting: 'edit',
              iconActive: 'close',
            }}
            actions={[{
              icon: 'C',
              title: 'CNSS',
              onClick: () => actions.openForm({ type: 'CNSS', company: { id: selectedCompanyId } }),
              className: theme.fabItem,
            }, {
              icon: 'R',
              title: 'IR',
              onClick: () => actions.openForm({ type: 'IR', company: { id: selectedCompanyId } }),
              className: theme.fabItem,
            }, {
              icon: 'S',
              title: 'IS',
              onClick: () => actions.openForm({ type: 'IS', company: { id: selectedCompanyId } }),
              className: theme.fabItem,
            }, {
              icon: 'V',
              title: 'TVA',
              onClick: () => actions.openForm({ type: 'VAT', company: { id: selectedCompanyId } }),
              className: theme.fabItem,
            }]}
          />}

      </div>
    );
  }
}

class CompanyLoad extends React.PureComponent{
  onScrollToTop = () => {
    const ref = this.refs.ops && this.refs.ops.getWrappedInstance();
    if (ref) {
      ref.scrollToTop();
    }
  }
  constructor(...args){
    super(...args);

    this.state = {
      company: this.props.company,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.company){
      this.setState({
        company: nextProps.company,
      });
    }
  }
  render(){
    const { company : companyCache, } = this.state;
    const { actions, theme, company, hasErrors, loading, } = this.props;

    if(loading){

      if(companyCache){
        return (
          <div style={{ height: '100vh', flex: 1, display: 'flex', flexDirection: 'column', }}>

            <Heading
              theme={theme}
              company={companyCache}
              actions={actions}
              onScrollToTop={this.onScrollToTop}
            />

            <Ops
              theme={theme}
              company={companyCache}
              actions={actions}
              ref={'ops'}
            />

          </div>
        );
      }

      return (
        <div style={{ height: '100vh', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <Loading/>
        </div>
      );
    }

    if(hasErrors){
       return (
        <div style={{ height: '100vh', flex: 1, flexDirection: 'column', color: '#d9534f', fontSize: 36, justifyContent: 'center', alignItems: 'center', display: 'flex', }}>
          <i style={{ fontSize: 48, }} className='material-icons'>error_outline</i>
          <div>Il y a eu une erreur. Veuillez rafraîchir la page.</div>
        </div>
      );
    }

    return (
      <div style={{ height: '100vh', flex: 1, display: 'flex', flexDirection: 'column', }}>

        <Heading
          company={company}
          theme={theme}
          actions={actions}
          onScrollToTop={this.onScrollToTop}
        />

        <Ops
          company={company}
          theme={theme}
          actions={actions}
          ref={'ops'}
        />

      </div>
    );
  }
}

const QUERY = gql`

  query getCompany($id: ID!){

      company(id: $id){
          id
          displayName

          logo {
            url
          }

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
        }

    }

`;

const withQuery = graphql(QUERY, {
  options: (ownProps) => ({
      variables: { id: ownProps.selectedCompanyId, },
      skip: typeof ownProps.selectedCompanyId === 'undefined',
    }),
  props: ({ ownProps, data }) => {
      if (data.loading) return { loading: true, hasErrors: false, };
      if (data.errors || data.error) return { hasErrors: true, loading: false, };

      return {
        company: data.company,
        loading: false,
        hasErrors: false,
      };
    }
});

CompanyLoad = withQuery(CompanyLoad);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: {
    onCompanyLogoClicked: (id) => dispatch(open('company', { id, })),
    openForm: (...args) => dispatch(open('form', ...args)),
  }};
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(Body, styles));

