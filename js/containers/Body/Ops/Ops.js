import React, {} from 'react';

import cx from 'classnames';

import isEmpty from 'lodash.isempty';

import moment from 'moment';

import Loading from 'components/Loading';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';

import { createOps } from './utils';

import {
  isServer,
} from 'utils/environment';

import {
  intlShape,
} from 'react-intl';


let Page, ScrollPagination, manager;

if (isServer) {

  ScrollPagination = Page = ({ children, ...props }) => <div {...props}>{children}</div>;

} else {

  const S = require('components/react-scroll-pagination');

  ScrollPagination = S.ScrollPagination;
  Page = ScrollPagination.Page;

  manager = new ScrollPagination.Manager();
}


class OpsLoad extends React.PureComponent{
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
  };

  state = {
    version: 0,
    ops: [],
    loading: false,
  };

  constructor(...args) {
    super(...args);

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    const { loading, hasErrors  } = this.props;
    if (loading || hasErrors) {
      return;
    }

    this.props.loadMore();
  }

  componentWillReceiveProps(nextProps){
    if (isServer) {
      return;
    }

    const self = this;

    const { loading, hasErrors, forms, company } = nextProps;
    const { version } = this.state;

    if(! loading && ! hasErrors) {

      this.setState({
        loading: true,
      }, function () {

        const args = {
          version,
          forms,
          since: (
            process.env.NODE_ENV === 'production'
            ? process.env.MOCK ? moment.utc().add(-15, 'years') : moment.utc(company.createdAt)
            : moment.utc().add(-15, 'years')
          ).startOf('day').toJSON(),
        };

        self.context.store.dispatch({
          task: 'GROUP_OPS',
          ...args,
        }).then(function ({ response }) {
          const { version, ops } = response;
          if(version === self.state.version){
            self.setState({
              loading: false,
              ops,
            });
          }
        });
      });
    } else {
      this.setState({
        version: version + 1,
        loading: false,
      });
    }
  }

  render() {
    const { theme, loading, hasErrors, forms = [], company, actions } = this.props;

    if (hasErrors) {
      return (
        null
      );
    }

    const isLoading = loading || this.state.loading;

    if (isLoading/* || isServer*/) {

      if(! isEmpty(this.state.ops)){
        return (
          <Ops actions={actions} company={company} ops={this.state.ops} loadMore={this.loadMore} theme={theme}/>
        );
      }

      if (forms.length > 0 && this.state.ops.length === 0) {
        return (
          <Ops
            actions={actions}
            ops={getOps()}
            loadMore={this.loadMore}
            theme={theme}
            company={company}
          />
        );
      }

      return (
        <Loading/>
      );
    }

    function getOps() {
      const since =  (
        process.env.NODE_ENV === 'production'
        ? process.env.MOCK ? moment.utc().add(-15, 'years') : moment.utc(company.createdAt)
          : moment.utc().add(-15, 'years')
        ).startOf('day').toJSON();
      return createOps(
        forms,
        since
      );
    }

    return (
      <Ops
        actions={actions}
        ops={isServer || (forms.length > 0 && this.state.ops.length === 0) ? getOps() : this.state.ops}
        loadMore={this.loadMore}
        theme={theme}
        company={company}
      />
    );
  }
}

const QUERY = gql`

  query getForms($companyId: ID!, $offset: String){

    forms(companyId: $companyId, offset: $offset){
      id
      displayName
      type
      createdAt
      updatedAt
      timestamp
    }

  }

`;

const withQuery = graphql(QUERY, {
  options: (ownProps) => ({
    variables: {
      offset: null,
      companyId: ownProps.company.id,
    }
  }),
  props: ({ ownProps, data: { loading, errors, error, fetchMore, forms } }) => {
    if (loading) return { loading: true, hasErrors: false, };
    if (errors || error) return { hasErrors: true, loading: false, };

    const last = forms.length > 0 ? forms[forms.length - 1] : null;

    return {
      forms,
      loading: false,
      hasErrors: false,
      loadMore() {
        return fetchMore({
          variables: {
            offset: last && last.timestamp,
          },
          updateQuery: (previousQueryResult, { fetchMoreResult }) => {
            return {
              forms: [ ...previousQueryResult.forms, ...fetchMoreResult.data.forms ],
            };
          },
        });
      }
    };
  },
});

class Ops extends React.PureComponent{
  render(){
    const { theme, ops, actions, company } = this.props;
    let isEmpty = true;
    return (
      <ScrollPagination hasPrevPage={true} hasNextPage={true} loadNextPage={this.props.loadMore} manager={manager} className={'body'} style={{ flex: 1, overflowY: 'auto' }}>
        {ops.map(function ({ id, title, items }, index) {
          if(items.length === 0) {
            return null;
          }
          isEmpty = false;
          return  (
            <PeriodList company={company} actions={actions} key={id} id={id} theme={theme} items={items} title={title}/>
          );
        })}
        {isEmpty && <div style={styles.center}>Aucun formulaires à afficher.</div>}
      </ScrollPagination>
    );
  }
}

class PeriodList extends React.PureComponent{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  onItem(type, id) {
    this.props.actions.openForm({ type, id, company: this.props.company });
  }
  render(){
    const self = this;
    const { theme, title, items, id } = this.props;
    return (
      <Page manager={manager} id={id} className={ cx(theme.body_periodList, { open: true }) }>

        <div className={ cx(theme.sticky, theme.body_header) }>
          <h6>{title}</h6>
        </div>


        {items.map(function ({ type, id, displayName, timestamp, createdAt, updatedAt }) {
          return (
            <div className={ theme.body_item } key={id}>

              <a style={{ display: 'flex', alignItems: 'center' }} onClick={self.onItem.bind(self, type, id)} >

                <div style={styles.icon}>{getLabel(type)}</div>

                <div style={styles.info}>

                  <div style={styles.displayName}>{displayName}</div>

                  <div style={styles.date}>
                    {self.context.intl.formatRelative(
                      new Date(timestamp))}
                  </div>

                </div>

              </a>

            </div>
          );
        })}


      </Page>
    );
  }
}

const styles = {
   center: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: '1.4em',
  },

  icon: {
    padding: '3px 20px',
    fontSize: '2em',
    fontWeight: 900,
  },

  info: {
    display: 'flex',
    flexDirection: 'column',
  },

  displayName: {
    paddingTop: '3px',
    fontWeight: 500,
  },

  date: {
    fontSize: '11px',
    color: '#ccc',
  },
};

function getLabel(type) {
  switch (type) {
    case 'CNSS': return 'C';
    case 'IR':   return 'R';
    case 'IS':   return 'S';
    case 'VAT':  return 'V';
  }
}

export default withQuery(OpsLoad);

