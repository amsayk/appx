import React, {} from 'react';

import CSSModules from 'react-css-modules';

import styles from './PdfViewer.scss';

import base64ToUint8Array from 'utils/base64ToUint8Array';

import Modal from 'react-bootstrap/lib/Modal';

import Loading from 'components/Loading';

import Alert from 'components/Alert';

import Dialog, { Body, } from 'containers/ModalContainer/Dialog';

import cx from 'classnames';

const ModalHeader = Modal.Header;
const ModalFooter = Modal.Footer;

class PdfViewer extends React.Component{
  static propTypes = {
    getPdf: React.PropTypes.func.isRequired,
    title: React.PropTypes.string.isRequired,
    subtitle: React.PropTypes.string,
    actions: React.PropTypes.shape({
      onClose: React.PropTypes.func.isRequired
    }).isRequired,
  };
  constructor(...args){
    super(...args);

    this.state = {
      url: null,
      loading: true,
      error: false,
    };

    this.onDownload = this.onDownload.bind(this);
    this.onRetry = this.onRetry.bind(this);

    if(this.props.modalOpen){
      this.onRetry(this.props);
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.modalOpen){
      this.onRetry(nextProps);
    } else{
      this.setState({
        url: null,
        loading: true,
        error: false,
      });
    }
  }
  onDownload(){
    const {url} = this.state;
    if(url){
      const [ _, base64, ] = url.split(/,/);
      require.ensure([], function (require) {
        const {saveAs} = require('utils/fileSaver');
        saveAs([base64ToUint8Array(base64)], `Téléchargement-${new Date().getTime()}.pdf`, 'application/pdf;charset=utf-8');
      }, 'FileSaver');
    }
  }
  onRetry(props){
    props.getPdf().then(
      (url) => this.setState({ loading: false, error: false, url, }),
      (error) => this.setState({ loading: false, error: true, url: null, })
    );
  }
  render(){
    const { styles : theme, title, subtitle, modalOpen, actions, } = this.props;
    const { loading, error, url, } = this.state;

    let content = null;

    if(loading){
      content = (
        <div style={{ height: '100%', display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <Loading/>
        </div>
       );
    }

    if(error){
      content = (
        <Alert title={'Erreur'} type={'error'}>
          Il y avait une erreur. Veuillez rafraîchir la page et réessayer.
        </Alert>
      );
    }

    function showPdf() {
      return (
        <div className={theme.content}>
          <iframe title={'Imprimé'} className={theme.pdfV} src={url}></iframe>
      	</div>
      );
    }

    return (
      <Modal dialogClassName={`${theme.modal} ${theme.mini} print-dialog`}
             dialogComponentClass={Dialog}
             animation={false}
             show={modalOpen} keyboard={true} backdrop={true} onHide={actions.onClose} autoFocus enforceFocus>

            <ModalHeader closeButton>
              <h3>
                {title}
              </h3>

              {subtitle && <h6 className={'text-muted'}>
                {subtitle}
              </h6>}

            </ModalHeader>

            <Body>
              {content || showPdf()}
            </Body>

            <ModalFooter>

              <div style={{ display: 'flex', justifyContent: 'space-between', }}>

                <div style={{ display: 'flex', justifyContent: 'flex-start', }}>

                  <div style={{ display: 'flex', justifyContent: 'space-around', }}>

                    <button
                      className={cx(theme.btn, theme.dark, 'unselectable')}
                      onClick={actions.onClose}>{'Fermer'}</button>


                    {process.env.NODE_ENV !== 'production' && <button
                      style={{ marginLeft: 12, }}
                      className={cx(theme.btn, theme.dark, 'unselectable')}
                      onClick={this.onRefresh}>{'Rafraîchir'}</button>}

                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', }}>

                  <button
                    className={cx(theme.btn, theme.primary, 'unselectable')}
                    onClick={this.onDownload}>{'Imprimer'}</button>

                </div>

              </div>

            </ModalFooter>

       </Modal>
    );
  }
}

export default CSSModules(PdfViewer, styles);
