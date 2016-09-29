import React, {} from 'react';

export default class extends React.Component{
  static displayName = 'Empty';
  render(){
    return (
        <div style={{ height: '100vh', fontSize: 36, display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', }}>

          <i className={'material-icons md-48'}>hourglass_empty</i>

          <div>Choisir une société à gauche.
          </div>

        </div>
    );
  }
}
