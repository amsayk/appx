import React, {} from 'react';

import {
  Menu,
  MainButton,
  ChildButton,
} from 'react-mfb-google-icons';

export default class extends React.PureComponent{
  static displayName = 'Fab';
  static propTypes = {

    main: React.PropTypes.shape({
      iconResting: React.PropTypes.string.isRequired,
      iconActive: React.PropTypes.string.isRequired,
    }).isRequired,

    actions: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired,
      }).isRequired,
    ).isRequired,

    effect: React.PropTypes.oneOf([
        'zoomin'
    ]).isRequired,

    position: React.PropTypes.oneOf([
        'br'
    ]).isRequired,

    method: React.PropTypes.oneOf([
        'hover'
    ]).isRequired,

  };

  static contextTypes = {
    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    effect: 'zoomin',
    position: 'br',
    method: 'hover',
  };

  componentDidMount(){
    const { joyride } = this.context;

    const steps = [{
      id: `fab`,
      text: 'Voici où vous pouvez ajouter des formulaires.',
      selector: `.mfb-component__button--main`,
      position: 'left',
      type: 'hover',
    }];

    setTimeout(function () {
      joyride.addSteps(steps);
    }, 50);

  }

  render(){
    const { effect, position, method, main, actions } = this.props;
    return (
      <div className={'fab'}>

        <Menu effect={effect} position={position} method={method}>

          <MainButton iconResting={main.iconResting} href={null} iconActive={main.iconActive}/>

          {actions.map(({ title, icon, onClick, className }, index) => (
             <ChildButton
               key={index}
               icon={icon}
               label={title}
               onClick={onClick}
               className={className}
             />
          ))}

		    </Menu>

			</div>
    );
  }
}
