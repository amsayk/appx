import React, {} from 'react';

import PdfViewer from './PdfViewer';

import ModalContainer from '../../containers/ModalContainer';

export default ModalContainer.create('pdfViewer', function (props) {
  return (
    <PdfViewer {...props}/>
  );
});
