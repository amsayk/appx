import React from 'react';
import { render } from 'react-dom';
import DevTools from 'containers/DevTools';

export default function showDevTools(store) {
  if(window.devToolsExtension){
    return;
  }

  const popup = window.open(null, 'Redux DevTools', 'width=300,height=600,menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
  // Reload in case it already exists
  popup.location.reload();

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root')
    );
  }, 10);
}