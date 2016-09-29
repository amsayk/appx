import React, {} from 'react';

import CSSModules from 'react-css-modules';

import styles from './BottomBar.scss';

import cx from 'classnames';

import MySplitButton from './MySplitButton';

import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

const TITLE = (
  <span>
    {'Plus'}{' '}<i style={{ verticalAlign: 'middle', opacity: 0.7, }} className='material-icons'>more_horiz</i>
  </span>
);

class BottomBar extends React.PureComponent{
  static propTypes = {
    onSaveOnly: React.PropTypes.func.isRequired,
    onSaveAndClose: React.PropTypes.func.isRequired,

    onCancel: React.PropTypes.func.isRequired,
    cancelLabel: React.PropTypes.string,

    id: React.PropTypes.string,

    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired,
      onSelect: React.PropTypes.func.isRequired,
    }).isRequired),

    onPrint: React.PropTypes.func,

    disabled: React.PropTypes.bool.isRequired,
  };
  static defaultProps = {
    submitting: false,
    pristine: false,
  };
  constructor(...args){
    super(...args);

    this.onSelect = this.onSelect.bind(this);
  }
  onSelect(eventKey){
    const {
      actions,
    } = this.props;

    for(let i = 0; i < actions.length; i++){
      if(actions[i].id === eventKey){
        actions[i].onSelect();
        break;
      }
    }
  }
  render(){
    const {
      styles : theme,
      id,
      onSaveOnly,
      onSaveAndClose,
      onCancel,
      cancelLabel,
      actions,
      onPrint,
      pristine,
      submitting,
    } = this.props;

    const hasActions = id && (typeof onPrint !== 'undefined' || actions.length > 0);

    return (
      <div className={theme.BottomBar}>

        <div className={theme.Cancel}>

          <button
            onClick={onCancel}
            disabled={submitting}
            className={cx('unselectable', theme.btn, theme.dark)}>{cancelLabel || 'Annuler'}
          </button>

        </div>

        {hasActions && <div className={theme.Actions}>

          <div className={theme.Wrapper}>

            {typeof onPrint !== 'undefined' && <div className={theme.PrintAction}>

              <button
                onClick={onPrint}
                disabled={pristine || submitting}
                className={cx('unselectable btn btn-link')}>{'Imprimer'}
              </button>

            </div>}
            {actions.length > 0 && <div className={theme.MoreActions}>

            <DropdownButton
              noCaret
              onSelect={this.onSelect}
              dropup
              title={TITLE}
              className={cx('unselectable', theme.MoreActionsToggle)}
              bsStyle={'link'}>

              {actions.map(({ id, title, }) => (
                <MenuItem key={id} className={'dropdown-item'} eventKey={id}>{title}</MenuItem>
              ))}

            </DropdownButton>

            </div>}

          </div>

        </div>}

        <div className={theme.SaveToolbar}>

          <MySplitButton
            className={cx('unselectable', theme.btn, theme.primary)}
            theme={theme}
            disabled={pristine || submitting}
            onSaveOnly={onSaveOnly}
            onSaveAndClose={onSaveAndClose}
          />

        </div>

      </div>
    );
  }
}

export default CSSModules(BottomBar, styles);
