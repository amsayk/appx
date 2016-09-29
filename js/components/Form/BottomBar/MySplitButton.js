import React, {} from 'react';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

export default class MySplitButton extends React.PureComponent{
  render(){
    const { theme, onSaveOnly, onSaveAndClose, className, disabled, } = this.props;
    return (
      <div className={theme.dropdown}>
        <ButtonToolbar>

          {onSaveOnly && <button
            onClick={onSaveOnly}
            disabled={disabled}
            className={`${theme.SaveOnly} ${disabled ? 'disabled' : ''} ${className} btn btn-default ${theme.btn} ${theme.dark}`}>
            {' '}{'Enregistrer'}
          </button>}

          {onSaveAndClose && <button
            onClick={onSaveAndClose}
            disabled={disabled}
            className={`${theme.SaveAndClose} ${disabled ? 'disabled' : ''} ${className} btn btn-default ${theme.btn} ${theme.dark}`}>
            {' '}{'Enregistrer et fermer'}
          </button>}

        </ButtonToolbar>
      </div>
    );
  }
}
