import React, {} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import { open, close, } from 'redux/reducers/modals/actions';
import { stepCompleted, helpSkipped } from 'redux/reducers/help/actions';

import cx from 'classnames'

import Joyride from 'react-joyride';

import getSelector from './selector';

export default class ModalContainer{
  static create(key, renderFn){

    const selector = getSelector(key);

    function mapStateToProps(state, props) {
      return selector(state, props);
    }

    function mapDispatchToProps(dispatch) {
      return {
        actions: bindActionCreators({
          onClose: () => close(key),
          refresh: (id) => open(key, { id, }),
          openModal: (...args) => requestAnimationFrame(() => dispatch(open(...args))),
          stepCompleted: (id) => stepCompleted(id),
          helpSkipped: helpSkipped,
        }, dispatch),
      };
    }

    class Container extends React.PureComponent{
      state = {
        joyrideType: 'single',
        joyrideOverlay: true,
        steps: [],
      };

      constructor(...args) {
        super(...args);

        this.addSteps = this.addSteps.bind(this);
        this.addTooltip = this.addTooltip.bind(this);
        this.isHelpSkipped = this.isHelpSkipped.bind(this);
        this.isStepCompleted = this.isStepCompleted.bind(this);
        this.helpCallback = this.helpCallback.bind(this);
      }

      static childContextTypes = {
        notificationMgr: React.PropTypes.shape({
          notify: React.PropTypes.func.isRequired,
          dismiss: React.PropTypes.func.isRequired,
        }).isRequired,

        joyride: React.PropTypes.shape({
          addSteps: React.PropTypes.func.isRequired,
          addTooltip: React.PropTypes.func.isRequired,
        }).isRequired,
      };

      getChildContext(){
        return {
          notificationMgr: window.notificationMgr,
          joyride: {
            addSteps: this.addSteps,
            addTooltip: this.addTooltip,
          },
        };
      }

      static displayName = `ModalContainer(${key})`;
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
      render(){
        // const { modalOpen, ...props } = this.props;
        // return modalOpen && renderFn(props);
        return (
          <div className={cx(`modal-wrapper-${key} has-modal-help`, { open: this.props.modalOpen })}>
            {renderFn(this.props)}
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

    return connect(mapStateToProps, mapDispatchToProps)(Container);
  }


}
