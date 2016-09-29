import React, {} from 'react';

import styles from './Dialog.scss';

import CSSModules from 'react-css-modules';

import cx from 'classnames';

function Dialog({ styles : theme, dialogClassName, className, bsClass, tabIndex, style, role, onClick, children, }) {
  return (
    <div style={style} className={cx(bsClass, className, dialogClassName)} tabIndex={tabIndex} role={role} onClick={onClick}>

      <div className={theme.trowser}>

        <div className={theme.body}>

          {children}

        </div>

      </div>

    </div>
  );
}


// class Dialog extends React.PureComponent {
//   state = {
//     inTransition: true,
//   };
//   onTransitionEnd = () => {
//     console.log('onTransitionEnd');
//     this.setState({
//       inTransition: false,
//     });
//   }
//   render() {
//     const { styles : theme, dialogClassName, className, bsClass, tabIndex, style, role, onClick, children, } = this.props;
//     return (
//       <div style={style} className={cx(bsClass, className, dialogClassName)} tabIndex={tabIndex} role={role} onClick={onClick}>
//
//         <div onTransitionEnd={this.onTransitionEnd} className={theme.trowser}>
//
//           <div className={theme.body}>
//
//             {this.state.inTransition ? null : children}
//
//           </div>
//
//         </div>
//
//       </div>
//     );
//   }
// }

export default CSSModules(Dialog, styles);

function DialogHeader({ styles : theme, children, light, }) {
  return (
    <header className={cx(theme.Header, { [theme.HeaderDark]: !light })}>
      {children}
    </header>
  );
}

DialogHeader.propTypes = {
  light: React.PropTypes.bool.isRequired,
}

DialogHeader.defaultProps = {
  light: false,
};


export const Header = CSSModules(DialogHeader, styles);

class DialogBody extends React.Component {
  static propTypes = {
    scrollable: React.PropTypes.bool.isRequired,
  }
  static defaultProps = { scrollable: true, };
  render() {
    const { scrollable, styles : theme, children, } = this.props;
    return (
      <div className={cx(theme.DialogBody, { [theme.scrollable]: scrollable, })}>
        {children}
      </div>
    );
  }
}

export const Body = CSSModules(DialogBody, styles);

function DialogFooter({ styles : theme, children, }) {
  return (
    <footer className={cx(theme.Footer)}>
      {children}
    </footer>
  );
}

export const Footer = CSSModules(DialogFooter, styles);
