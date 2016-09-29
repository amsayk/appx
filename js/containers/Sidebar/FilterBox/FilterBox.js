import React, {} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import selector from './selector';

import isEmpty from 'lodash.isempty';

import { filterCompanies, } from 'redux/reducers/sidebar/actions';

function FilterBox({ theme, filterText, actions, }){
  return (
    <div className={theme.FilterBox}>
      <div>
        <i className='material-icons'>search</i>
        <input autoFocus={! isEmpty(filterText)} value={filterText} onChange={e => actions.onSearch(e.target.value)} placeholder='Commencez à taper pour filtrer…' />
      </div>
    </div>
  );
}

FilterBox.propTypes = {

};

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({ onSearch: filterCompanies, }, dispatch)};
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBox);
