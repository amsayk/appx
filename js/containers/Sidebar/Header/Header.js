import React, {} from 'react';

import { connect, } from 'react-redux';

import cx from 'classnames';

export default class Header extends React.PureComponent{
  static displayName = 'SidebarHeader';
  static contextTypes = {
    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  }
  componentDidMount(){
    const steps = [{
      id: 'sidebarHeader-1',
      // title: 'Ajouter une société',
      text: 'Cliquer ici pour ajouter une société.',
      selector: '.add-company',
      position: 'bottom',
      type: 'hover',
    }];

    this.context.joyride.addSteps(steps);
  }
  render(){
    const { theme, onNewCompanyClick, } = this.props;
    return (
      <div className={theme.Header}>

        <div>

          <span className={theme.Brand}>Compta <sup>®</sup></span>

          <a tabIndex={-1} onClick={onNewCompanyClick} className={cx('btn btn-primary', theme.AddBtn, 'add-company')}>
          Ajouter
          </a>

        </div>

      </div>
    );
  }
}

Header.propTypes = {
};

