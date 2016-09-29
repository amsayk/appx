import React, {} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { toggleProfileMenu, } from 'redux/reducers/sidebar/actions';

import selector from './selector';

import Avatar from 'components/Avatar';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import cx from 'classnames';

const LOGOUT_KEY = '1';
const SETTINGS_KEY = '2';

class UserProfile extends React.Component{

  constructor(...args){
    super(...args);

    this.onSelect = this.onSelect.bind(this);
  }

  static contextTypes = {
    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  }
  componentDidMount(){
    const steps = [{
      id: 'userProfile-1',
      title: 'Gerer votre compte',
      text: 'Cliquer ici pour modifier votre profile et/ou changer votre mot de passe.',
      selector: '.user-profile-toggle',
      position: 'top',
      type: 'hover',
    }];

    this.context.joyride.addSteps(steps);
  }

  onSelect(key){
    switch (key) {
      case SETTINGS_KEY: {
        this.props.onSettingsClick();
        break;
      }
      case LOGOUT_KEY:{
        this.props.onLogoutClick();
        break;
      }

    }
  }

  render(){
    const { theme, currentUser, menuOpen, actions, } = this.props;

    return (
      <div className={theme.UserProfile}>
        <Avatar round size={48} name={currentUser.displayName}/>
        <div>
          <div className={theme.DisplayName}>

            <DropdownButton open={menuOpen} onToggle={actions.onToggleProfileMenu} noCaret onSelect={this.onSelect} dropup title={<span className={theme.DisplayNameText}>{currentUser.displayName}{' '}</span>} className={cx(theme.UserProfileMenuToggle, 'user-profile-toggle')} useAnchor bsStyle={'link'}>
              <MenuItem className={'dropdown-item'} eventKey={SETTINGS_KEY}>Mon compte</MenuItem>
              <MenuItem className={'dropdown-item'} eventKey={LOGOUT_KEY}>Déconnexion</MenuItem>
            </DropdownButton>

          </div>
          <div className={cx(theme.Email, 'text-muted')}>{currentUser.email}</div>
        </div>
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
      onToggleProfileMenu: toggleProfileMenu
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
