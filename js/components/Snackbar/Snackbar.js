import React, {} from 'react';

import {connect} from 'react-redux';

import cx from 'classnames';

import selector from './selector';

import CSSModules from 'react-css-modules';

import styles from './Snackbar.scss';

class Snackbar extends React.Component {

  constructor(...args) {
    super(...args);
    this._width = 0;
    this.state  = {};

    // ### Style

    this.state.style = {
      bottom     : 60,
      display    : 'none',
      left       : '50%',
      marginLeft : 0,
      position   : 'fixed',
      zIndex     : 9999
    };

    // ### Snackbar
    // Get the default snackbar state from the relay stores.

    /* this.state.snackbar = this.props.snackbar {
      active    : false,
      type      : null,
      message   : null,
      animation : null,
      persist   : false,
      action    : null
    } */;
  }

  /**
   * Align the snackbar component to the center of the screen.
   * @return {Void}
   */
  componentDidMount() {
    this.align();
  }

  /**
   * Component update optimization.
   * @param  {Object} nextProps
   * @param  {Object} nextState
   * @return {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {

    // ### Animation
    // Check if a new animation sequence has been requested.

    const curAnim = this.props.snackbar.animation;
    const nxtAnim = nextProps.snackbar.animation;

    if (nxtAnim !== curAnim) {
      return true;
    }

    // ### Alignment
    // Check if notification alignment has adjusted.

    const curAlign = this.state.style.marginLeft;
    const nxtAlign = nextState.style.marginLeft;

    if (nxtAlign !== curAlign) {
      return true;
    }

    return false;
  }

  /**
   * Align the snackbar when the component updates.
   * @param  {Object} prevProps
   * @param  {Object} prevState
   * @return {Void}
   */
  componentDidUpdate(prevProps, prevState) {
    this.align();
  }

  /**
   * Remove the relay subscription when the component unmounts.
   * @return {Void}
   */
  componentWillUnmount() {
  }

  /**
   * Centers the snackbar object.
   */
  align() {
    const cWidth = this.refs.snackbar.offsetWidth;
    const aWidth = this.refs.action ? this.refs.action.offsetWidth + 48 : 24;

    // ### Re-Align
    // Check if we need to re-align the element, since it can be somewhat
    // pixel sensetive we check if the remainder between new total and
    // previous width is more than 3px in width before re-alignment.

    if (this._width !== 0 && cWidth % this._width < 3) {
      return;
    }

    // ### Update Alignment

    this.setState({
      style : {
        ...this.state.style,
        marginLeft   : -(cWidth / 2),
        paddingRight : aWidth
      }
    });

    // ### Update
    // Update the width for future width checks

    this._width = cWidth;
  }

  /**
   * Returns the current class names for the snackbar.
   * @return {String}
   */
  getClass() {
    const { snackbar: { type, animation }, styles : theme, } = this.props;
    return cx({
      [theme.snackbar]  : true,
      [ theme[type] ]   : type      ? true : false,
      animated          : animation ? true : false,
      [animation]       : animation ? true : false
    });
  }

  /**
   * @return {Object}
   */
  getStyle() {
    const style = Object.assign({}, this.state.style);
    if (this.props.snackbar.active) {
      style.display = 'inline-block';
    }
    return style;
  }

  /**
   * @return {button}
   */
  getAction() {
    const { snackbar: { action }, styles : theme, } = this.props;
    if (action) {
      return (
        <button type='button' className={theme['btn-snackbar']} onClick={ action.click } ref='action'>{ action.title }</button>
      );
    }
  }

  /**
   * Renders the snackbar components.
   * @return {Object}
   */
  render() {
    const { message } = this.props.snackbar;
    return (
      <div className={ this.getClass() } style={ this.getStyle() } ref='snackbar'>
        { message }
        { this.getAction() }
      </div>
    );
  }

}

function mapStateToProps(state, props){
  return selector(state, props);
}

export default connect(mapStateToProps)(
  CSSModules(Snackbar, styles)
);
