import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import connectToStores from 'alt-utils/lib/connectToStores';

import Store from './store';
import Actions from './actions';

import CSSModules from 'react-css-modules';

import styles from './component.scss';

const ModalBody = Modal.Body;
const ModalFooter = Modal.Footer;

class Confirm extends React.Component {
  static displayName = 'Confirm';
  static propTypes = {
    title: PropTypes.string,
    sure: PropTypes.string,
    cancel: PropTypes.string,
  };
  static getStores() {
    return [Store];
  }
  static getPropsFromStores() {
    return Store.getState();
  }
  state = {};
  componentDidUpdate(){
    this._btn&&ReactDOM.findDOMNode(this._btn).focus();
  }
  render () {
    const { styles : theme, title, sure, cancel, message, } = this.props;
    return (
      <Modal className={theme['modal-wrapper']} backdropStyle={{}} aria-labelledby='contained-modal-title' bsSize='small' backdrop={'static'} onHide={Actions.cancel} show={!!message} keyboard={false}>
        {/*<Modal.Header closeButton>
          <Modal.Title>
            {title}
          </Modal.Title>
        </Modal.Header>*/}
        <ModalBody>
          {message}
        </ModalBody>
        <ModalFooter>
          <ButtonToolbar>

            <Button className={theme['left']} ref={ref => this._btn = ref} bsStyle='success' onClick={Actions.cancel}>
              {cancel}
            </Button>

            <Button className={theme['right']} bsStyle='danger' onClick={Actions.sure}>
              {sure}
            </Button>

          </ButtonToolbar>
        </ModalFooter>
      </Modal>
    )
  }
}

export default CSSModules(connectToStores(Confirm), styles, {allowMultiple: true});
