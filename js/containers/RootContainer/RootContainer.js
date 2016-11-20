import React, {} from 'react';

import {connect} from 'react-redux';

import addEventListener from 'dom-helpers/events/on';
import removeEventListener from 'dom-helpers/events/off';

import throttle from 'lodash.throttle';

import { resize } from 'redux/reducers/app/actions';

import { stepCompleted, helpSkipped } from 'redux/reducers/help/actions';

import selector from './selector';

import Title from 'components/Title';

import Joyride from 'react-joyride';

class RootContainer extends React.PureComponent {
  static propTypes = {
    children: React.PropTypes.element.isRequired,
    displayMatches: React.PropTypes.bool.isRequired,
  };
  static childContextTypes = {
    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  };
  getChildContext(){
    return {
      joyride: {
        addSteps: this.addSteps,
        addTooltip: this.addTooltip,
      },
    };
  }
  constructor(...args){
    super(...args);

    this.onResize = this.onResize.bind(this);

    this.addSteps = this.addSteps.bind(this);
    this.addTooltip = this.addTooltip.bind(this);
    this.isHelpSkipped = this.isHelpSkipped.bind(this);
    this.isStepCompleted = this.isStepCompleted.bind(this);
    this.helpCallback = this.helpCallback.bind(this);
  }
  onResize(){
    this.props.actions.resize();
  }
  componentDidMount(){
    addEventListener(window, 'resize', this.onResize);
  }
  componentWillUnmount(){
    removeEventListener(window, 'resize', this.onResize);
  }
  state = {
    joyrideType: 'single',
    joyrideOverlay: true,
    steps: [],
  };
  addSteps (steps) {
    if(this.isHelpSkipped()){
      return;
    }

    if (!Array.isArray(steps)) {
      steps = [steps];
    }

    steps = steps.filter(({ id, }) => ! this.isStepCompleted(id));

    if (!steps.length) {
      return false;
    }

    this.setState(function (currentState) {
      currentState.steps = currentState.steps.concat(this.refs.joyride.parseSteps(steps));
      return currentState;
    });
  }

  addTooltip (data) {
   this.refs.joyride.addTooltip(data);
  }
  isHelpSkipped(){
    return this.props.help.skipped === true;
  }
  isStepCompleted(id){
    return this.props.help.completed.includes(id);
  }
  helpCallback({ type, step, skipped, }) {
    const { actions, } = this.props;
    switch(type){
      case 'step:after':

        actions.stepCompleted(step.id);
        break;

      case 'finished':
        if(skipped){
          actions.helpSkipped();
        }
        break;

    }
  }
  render() {
    const { displayMatches, onLine, children : body, } = this.props;
    return (
      <div className={'root'}>

        <Title title={'Compta • Gestion des formulaires comptable'}/>

        {function(){
          if(!displayMatches){
            return <Center>Votre affichage est trop petit.</Center>;
          }

          if(!onLine){
            return <Center>Vous êtes hors ligne.</Center>;
          }

          return React.Children.only(body);
        }()}

        <Joyride
          run={true}
          ref={'joyride'}
          type={this.state.joyrideType}
          showOverlay={this.state.joyrideOverlay}
          steps={this.state.steps}
          callback={this.helpCallback}
          locale={{
            back: 'Précédent',
            close: 'OK',
            last: 'Dernier',
            next: 'Suivant',
            skip: 'Annuler',
          }}
        />

    </div>
    );
  }
}

const Center = ({ children, }) => (
  <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
    {children}
  </div>
);

function mapStateToProps(state, props) {
  return selector(state, props);
}

function mapDispatchToProps(dispatch) {
  return {actions: {
    resize: throttle(() => requestAnimationFrame(() => dispatch(resize())), 50),
    stepCompleted: (id) => dispatch(stepCompleted(id)),
    helpSkipped: () => dispatch(helpSkipped()),
  }};
}

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

