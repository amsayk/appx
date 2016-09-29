import React, {} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { toggle, toggleGroup, } from 'redux/reducers/sidebar/actions';
import { logout, } from 'redux/reducers/user/actions';

import { open, } from 'redux/reducers/modals/actions';

import selector from './selector';

import styles from './Sidebar.scss';

import CSSModules from 'react-css-modules';

import Header from './Header';
import FilterBox from './FilterBox';
import CompanyList from './CompanyList';
import UserProfile from './UserProfile';

class Sidebar extends React.Component {
  static propTypes = {
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

    hasErrors: React.PropTypes.bool.isRequired,
  }

  render() {
    const {
      styles : theme,
      sidebarCollapsed,
      groupExpanded,
      companies,
      selectedCompanyId,
      currentUser,
      hasErrors,
      actions,
    } = this.props;

    const collapsed = sidebarCollapsed || (groupExpanded !== -1);

    return (
      <div className={theme.Sidebar}>

        <Header
          onNewCompanyClick={actions.onNewCompanyClick}
          theme={theme}
        />

        <FilterBox theme={theme}/>

        <CompanyList
          companies={companies}
          theme={theme}
        />

        <UserProfile
          onLogoutClick={actions.onLogoutClick}
          onSettingsClick={actions.onSettingsClick}
          currentUser={currentUser}
          theme={theme}
        />

      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      toggle,
      toggleGroup,
      onLogoutClick: logout,
      onSettingsClick: () => open('account'),
      onNewCompanyClick: () => open('company'),
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CSSModules(Sidebar, styles));
