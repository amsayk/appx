import React, {} from 'react';

import { connect, } from 'react-redux';

import { createSelector, } from 'utils/reselect';

import selector from './selector';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import cx from 'classnames';

import Loading from 'components/Loading';

import { filterOps } from 'redux/reducers/body/actions';
import { open } from 'redux/reducers/modals/actions';

import isEmpty from 'lodash.isempty';

import createHighlighter from 'utils/createHighlighter';
import intersperse from 'utils/intersperse';

import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import {
  isServer,
} from 'utils/environment';

import {
  intlShape,
} from 'react-intl';

class SearchBox extends React.PureComponent{
  static contextTypes = {
    store: React.PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  };
  constructor(...args){
    super(...args);

    this.state = {
      open: false,
      results: [],
      loading: false,
      version: 0,
      inTransition: false,
    };

    this.onOpen = this.onOpen.bind(this);
    this.displaySearchResults = this.displaySearchResults.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.onRootClose = this.onRootClose.bind(this);
    this.load = this.load.bind(this);
  }

  onRootClose(){
    this.setState({
      inTransition: false,
      open: false,
    }, () => {
     (this.props.filterText !== '') && this.props.actions.onChange({ target: { value: '' }});
    });
  }

  onOpen(){
    this.setState({
      inTransition: true,
      open: true,
    });
  }

  load(props) {
    const self = this;

    const { loading, hasErrors, forms, filterText } = props;
    const { version } = this.state;

    if(! loading && ! hasErrors && ! isEmpty(filterText)) {

      this.setState({
        loading: true,
        results: [],
      }, function () {

        self.context.store.dispatch({
          task: 'FILTER_OPS',
          version,
          forms,
          filterText,
        }).then(function ({ response }) {
          const { version, results } = response;
          if(version === self.state.version){
            self.setState({
              loading: false,
              results,
            });
          }
        });
      });
    } else {
      (this.state.results.length > 0 || this.state.loading) && this.setState({
        version: version + 1,
        loading: false,
        results: [],
      });
    }
  }

  componentWillReceiveProps(nextProps){
    this.load(nextProps);
  }

  componentDidMount(){
    const { joyride } = this.context;

    const steps = [{
      id: `form-SearchBox`,
      text: 'Rechercher l\'ensemble des vos formulaires ici.',
      selector: `.form-SearchBox`,
      position: 'bottom',
      type: 'hover',
    }];

    setTimeout(function () {
      joyride.addSteps(steps);
    }, 500);

  }

  displaySearchResults(){
    const self = this;
    const { loading, hasErrors, forms, filterText } = this.props;

    const inputOpen = this.state.open || (! isEmpty(filterText));

    const open = inputOpen && (
      this.state.results.length !== 0 || ! (this.state.loading || loading || hasErrors)
    );

    const h = createHighlighter(filterText);


    function getLabel(type) {
      switch (type) {
        case 'CNSS': return 'C';
        case 'IR':   return 'R';
        case 'IS':   return 'S';
        case 'VAT':  return 'V';
      }
    }

    return (
      <DropdownMenu onClose={this.onRootClose} open={open && ! this.state.inTransition}>
        {this.state.inTransition ? [] : this.state.results.map(function ({ type, displayName, id, timestamp, createdAt, updatedAt }) {
          const nodes = intersperse(displayName.split(/\s+/).map(h.highlight), ' ');
          return (
            <MenuItem onSelect={self.onItem.bind(self, type, id)} key={id} eventKey={id}>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                <div style={styles.searchResultIcon}>{getLabel(type)}</div>

                <div style={styles.searchResultInfo}>

                  <div style={styles.displayName}>{nodes}</div>

                  <div style={styles.date}>       &middot;&nbsp;

                    <span>Vu {self.context.intl.formatRelative(
                      new Date(timestamp))} &middot;&nbsp;</span>

                    {updatedAt !== createdAt && <span>Modifié {self.context.intl.formatRelative(
                      new Date(updatedAt))} &middot;&nbsp;</span>}

                    <span>Créé {self.context.intl.formatRelative(
                      new Date(createdAt))}</span>


                  </div>

                </div>

              </div>
            </MenuItem>
          );
        })}
      </DropdownMenu>
    );
  }

  onTransitionEnd(){
    this.setState({
      inTransition: false,
    });
  }

  onItem(type, id){
    this.setState({
      inTransition: false,
      open: false,
    }, () => {
      this.props.openForm({ type, id, company: this.props.company });
    });
  }

  render(){
    const { theme, actions, filterText : query, loading, hasErrors } = this.props;
    const inputOpen = this.state.open; // || (! isEmpty(query));
    const searchOpen = inputOpen && (
      this.state.results.length > 0 // || (! this.state.loading && ! loading && ! hasErrors)
    );
    return (
      <div className={theme.SearchBox} style={styles.container}>

        <div style={styles.searchLine} className={theme.searchLine}>

          <input
            onTransitionEnd={this.onTransitionEnd}
            onChange={actions.onChange}
            value={query}
            onFocus={this.onOpen}
            placeholder={'Rechercher…'}
            className={'form-control form-SearchBox'}
            style={inputOpen ? { ...styles.input, ...styles.open, } : { ...styles.input}}
            type={'search'}
          />

        {this.state.loading && ! loading ? <Loading/> : <i className='material-icons' style={styles.i}>search</i>}

      </div>

      <div className={cx({ open: searchOpen }, theme.searchResults)} style={styles.resultsLine}>
        {this.displaySearchResults()}
      </div>


    </div>
    );
  }
}

const QUERY = gql`

  query getAllForms($companyId: ID!){

    allForms(companyId: $companyId){
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
      companyId: ownProps.company.id,
    }
  }),
  props: ({ ownProps, data }) => {
    if (data.loading) return { loading: true, hasErrors: false };
    if (data.errors || data.error) return { hasErrors: true, loading: false };

    return {
      forms: data.allForms || [],
      loading: false,
      hasErrors: false,
    };
  },
});

const styles = {

  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },

  searchLine: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    textAlign: 'right',
  },

  resultsLine: {
    display: 'flex',
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },

  i: {
    marginLeft: -30,
    color: '#aaa',
  },

  input: {
    width: 200,
  },

  open: {
    width: 400,
    transition: 'width 0.5s',
  },

  searchResultIcon: {
    padding: '3px 20px 3px 0',
    fontSize: '2em',
    fontWeight: 900,
  },

  searchResultInfo: {
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

function mapStateToProps(state){
  return selector(state);
}

function mapDispatchToProps(dispatch, props){
  return {
    actions: {
      ...props.actions,
      onChange: (evt) => dispatch(filterOps(evt.target.value)),
    }
  };
}

SearchBox = connect(mapStateToProps, mapDispatchToProps)(SearchBox);

export default withQuery(SearchBox);
