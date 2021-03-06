import React, {Component} from 'react';

import CSSModules from 'react-css-modules';

import styles from './Loading.scss';

class Loading extends React.PureComponent {
  shouldComponentUpdate(){
    return false;
  }
  renderEllipsis() {
    return (
      <div>
        <span className='Loader'>
          <div styleName='Loader-indicator'>
            <h6>
              <span className='Loader-ellipsis'>
                <span styleName='Loader-ellipsisDot'>&middot;</span>
                <span styleName='Loader-ellipsisDot'>&middot;</span>
                <span styleName='Loader-ellipsisDot'>&middot;</span>
              </span>
            </h6>
          </div>
        </span>
      </div>
    );
  }
  render() {
    if (this.props.type === 'dots') {
      return this.renderEllipsis();
    }

    return (
      <div styleName='loading-spinner' className='loading-spinner'>

        <div className='mdl-spinner mdl-js-spinner is-active is-upgraded'
             data-upgraded=',MaterialSpinner'>
          <div className='mdl-spinner__layer mdl-spinner__layer-1'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-2'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-3'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
          <div className='mdl-spinner__layer mdl-spinner__layer-4'>
            <div className='mdl-spinner__circle-clipper mdl-spinner__left'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__gap-patch'>
              <div className='mdl-spinner__circle'></div>
            </div>
            <div className='mdl-spinner__circle-clipper mdl-spinner__right'>
              <div className='mdl-spinner__circle'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CSSModules(Loading, styles, {
  allowMultiple: true
});
