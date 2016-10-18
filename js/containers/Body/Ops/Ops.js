import React, {} from 'react';

import cx from 'classnames';

import isEmpty from 'lodash.isempty';

import moment from 'moment';

import Loading from 'components/Loading';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownMenu from 'react-bootstrap/lib/DropdownMenu';

import {
  isServer,
} from 'utils/environment';

import {
  intlShape,
} from 'react-intl';

import ScrollSpy, { Anchor } from 'components/ScrollSpy';

import intersperse from 'utils/intersperse';

class Extrapolation extends React.PureComponent {
  scrollToTop = () => {
    this.refs.scrollSpy && this.refs.scrollSpy.scrollToTop();
  };

  render() {
    const { theme, hasErrors, loading, extrapolation, company, actions } = this.props;

    if (hasErrors) {
      return null;
    }

    if (loading) {
      return (
        <Loading/>
      );
    }

    if (extrapolation) {
      const { pages, totalLength } = extrapolation;

      if (totalLength === 0) {
        return (
          <div className={'body'} style={{ flex: 1, overflowY: 'auto' }}>
            <div style={styles.center}>Aucun formulaires à afficher.</div>
          </div>
        );
      }

      return (
        <ScrollSpy ref={'scrollSpy'}>
          <div className={'body'} style={{ flex: 1, overflowY: 'auto' }}>
            {pages.map(function ({ id, title, from, to, length }, index) {
              return  (
                <Anchor id={index} key={id}>
                  <PageLoad
                    company={company}
                    actions={actions}
                    theme={theme}
                    id={id}
                    from={from}
                    to={to}
                    length={length}
                    title={title}
                    extrapolation={extrapolation}
                    index={index}
                  />
                </Anchor>
              );
            })}
            <div className={''} style={{ borderTop: '1px solid #ccc', padding: '20px 0' }}>
              <div style={styles.center}>Plus de formulaires à afficher.</div>
            </div>
          </div>
        </ScrollSpy>
      );
    }
  }
}

const EXTRAPOLATION_QUERY = gql`

  query getExtrapolation($companyId: ID!) {

    extrapolation(companyId: $companyId) {
      totalLength
      timestamp
      pages {
        id
        title
        from
        to
        length
      }
    }

  }

`;

const withExtrapolationQuery = graphql(EXTRAPOLATION_QUERY, {
  withRef: true,
  options: (ownProps) => ({
    variables: {
      companyId: ownProps.company.id,
    },
  }),
  props: ({ ownProps, data: { loading, error, errors, extrapolation } }) => {
    if (loading) return { loading: true, hasErrors: false };
    if (errors || error) return { hasErrors: true, loading: false };

    return {
      extrapolation,
      loading: false,
      hasErrors: false,
    };
  },
});

Extrapolation = withExtrapolationQuery(Extrapolation);

class PageLoad extends React.PureComponent {
  render() {
    const { theme, index, extrapolation, length, id, title, activeTarget = 0 } = this.props;

    if (length === 0) {
      return null;
    }

    function doSkip(extrapolation, index) {
      let acc = 0;

      for (let i = 0; i < index; i++) {
        const page = extrapolation.pages[i];
        acc += page.length;
      }

      return acc >= 25;
    }

    const active = index <= activeTarget;

    const skip = ! active && doSkip(extrapolation, index);

    return (
      <Page {...this.props} skip={skip}/>
    );
  }
}

class PageInfo extends React.PureComponent {
  static propTypes = {
    length: React.PropTypes.number.isRequired,
    forms: React.PropTypes.array.isRequired,
  };
  constructor(...args) {
    super(...args);

    this.onHover = this.onMouse.bind(this, true);
    this.onBlur = this.onMouse.bind(this, false);
  }
  state = { onHover: false };
  onMouse(state) {
    this.setState({
      onHover: state,
    });
  }
  render() {
    const { theme, length, forms } = this.props;
    const { onHover  } = this.state;

    function splitByType() {
      const groups = forms.reduce((res, { type })=> {
        if (! res[type]) {
          res[type] = 0;
        }
        res[type]++;
        return res;
      }, {});
      const comps = Object.keys(groups).map((key) => {
        return (
          <em>
            <span>{key === 'VAT' ? 'TVA' : key}</span>: <b>{groups[key]}</b>
          </em>
        );
      });

      return intersperse(comps, ', ');
    }

    return (
      <div onMouseEnter={this.onHover} onMouseLeave={this.onBlur} className={theme.h6} style={{ opacity: onHover ? 1.0 : 0.3, textTransform: 'none', fontStyle: 'italic', minWidth: 300, textAlign: 'right' }}>
        {length} {length > 1 ? 'formulaires' : 'formulaire'}
        {onHover
            ? <span> ({splitByType()})</span>
            : null}
      </div>
    );
  }
}

class Page extends React.PureComponent {
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  onItem(type, id) {
    this.props.actions.openForm({ type, id, company: this.props.company });
  }
  render() {
    const self = this;
    const { theme, hasErrors, loading, forms = [], actions, id, title, length, index, activeTarget = 0 } = this.props;

    return (
      <div id={id}>

        <div className={ cx(theme.sticky, theme.body_header) } style={{ display: 'flex' }}>
          <h6 className={theme.h6}>{title}</h6>

          <div style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}>
            {loading ? <Loading type={ 'dots' }/> : <PageInfo theme={theme} length={length} forms={forms}/>}
          </div>
        </div>

        <div style={{ height: index > activeTarget + 1 ? 0 : (length * 68.9555555556) }}>

          {hasErrors ?  null :

          forms.map(function ({ id, displayName, type, timestamp, updatedAt, createdAt }) {
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

        </div>

      </div>
    );
  }
}

const PAGE_QUERY = gql`

  query getFormsByPage($companyId: ID!, $from: String!, $to: String!) {

    forms: formsByPage(companyId: $companyId, from: $from, to: $to) {
      id
      displayName
      type
      createdAt
      updatedAt
      timestamp
    }
  }

`;

const withPageQuery = graphql(PAGE_QUERY, {
  options: (ownProps) => ({
    variables: {
      companyId: ownProps.company.id,
      from: new Date(ownProps.from).toISOString(),
      to: new Date(ownProps.to).toISOString(),
    },
    skip: ownProps.skip,
  }),
  props: ({ ownProps, data: { loading, error, errors, forms } }) => {
    if (ownProps.length === 0 || ownProps.skip) {
      return {
        forms: [],
        loading: false,
        hasErrors: false,
      };
    }

    if (loading) return { loading: true, hasErrors: false };
    if (errors || error) return { hasErrors: true, loading: false };

    return {
      forms,
      loading: false,
      hasErrors: false,
    };
  },
});

Page = withPageQuery(Page);

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

export default Extrapolation;

