import React, {PropTypes} from 'react';

import styles from './Alert.scss';

import cx from 'classnames';

import CSSModules from 'react-css-modules';

class Alert extends React.Component{
  static displayName = 'Alert';
  static propTypes = {
    type: PropTypes.oneOf([ 'error', 'info', 'warning' ]).isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    children: PropTypes.node.isRequired,
  };
  static contextTypes = {

  };
  constructor(...args){
    super(...args);

    this._close = this._close.bind(this);
  }
  _close = (e) => {
    this.props.onClose && this.props.onClose();
  };
  render(){
    const { type, onClose, title, children, } = this.props;
    return (
      <div styleName={cx('alert-view', {
        'alert-error': type === 'error',
        'alert-warn': type === 'warning',
        'alert-info': type === 'info',
      })}>
        <div styleName='alert-header'>
          <i styleName='secondary-color-sprite icon'></i><span styleName='title'>{title}:</span>{typeof onClose !== 'undefined' ? <i onClick={this._close} styleName={'close-sprite icon-close'}></i> : null}
        </div>
        <div styleName='alert-content'>{children}</div>
      </div>
    );
  }
}

export default CSSModules(Alert, styles, {allowMultiple: true});
