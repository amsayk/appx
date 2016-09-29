import React, {} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import cx from 'classnames';

import selector from './selector';

import { selectCompany, } from 'redux/reducers/sidebar/actions';

import createHighlighter from 'utils/createHighlighter';

import intersperse from 'utils/intersperse';

function CompanyList({ theme, companies, filterText, selectedCompanyId, actions, }){
  const h = createHighlighter(filterText);
  return (
    <div className={theme.CompanyList}>
      {companies.map((company, index) => {
        const nodes = intersperse(company.displayName.split(/\s+/).map(h.highlight), ' ');
        return (
          selectedCompanyId === company.objectId
            ? <div className={cx([theme.CompanyItem, theme.Active])} key={index}>{nodes}</div>
            : <a tabIndex={-1} onClick={() => actions.onCompanySelected(company.objectId)} className={cx([theme.CompanyItem, theme['CompanyItem--free']])} key={index}>{nodes}</a>
        );
      })}
    </div>
  );
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ onCompanySelected: selectCompany, }, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(CompanyList);
