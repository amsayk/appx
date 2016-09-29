import React, {} from 'react';

import CSSModules from 'react-css-modules';

import styles from './TopBar.scss';

import Avatar from 'components/Avatar';

class TopBar extends React.Component{
  static propTypes = {
    title: React.PropTypes.any.isRequired,
  };
  render(){
    const { styles : theme, title, icon, uppercase, } = this.props;
    return (
      <div className={theme.TopBar}>

        <div className={theme.Wrapper}>

          <div className={theme.Left}>

            <div className={theme.Title}>
              <div><i style={{ verticalAlign: 'sub', }} className='material-icons'>more_vert</i> {title}</div>
            </div>

          </div>

          <div className={theme.Right}>

            <div className={theme.Close}>

              <Avatar size={48} round uppercase value={icon}/>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default CSSModules(TopBar, styles);
