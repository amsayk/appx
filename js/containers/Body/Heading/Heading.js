import React, {} from 'react';

import SearchBox from '../SearchBox';

class Heading extends React.PureComponent{
  static displayName = 'BodyHeading';
  onHeadingClicked = () => {
    this.props.onScrollToTop();
  };
  render(){
    const { theme, actions, company } = this.props;
    return (
      <div onClick={this.onHeadingClicked} className={'heading'} style={styles.container}>

        <div className={theme.logo} style={{}}>
          <a onClick={() => actions.onCompanyLogoClicked(company.id)} className={'btn btn-link'} style={styles.a}>

            {company.logo
              ?  <img {...styles.logo} src={company.logo.url}/>
              :  logoAlt
            }

            <div style={styles.companyName}>
              {company.displayName}
            </div>

          </a>
        </div>

        <div className={theme.searchBox} style={{ display: 'flex', justifyContent: 'flex-end', flex: 1, }}>
          <SearchBox openForm={actions.openForm} company={company} theme={theme}/>
        </div>

      </div>
    );
  }
}

const styles = {

  logo: {

    style : {

    },
  },

  logoAlt: {
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#c7c7c7',
    border: '1px dotted #c7c7c7',
    borderRadius: 3,
    height: 56,
    verticalAlign: 'top',
    textAlign: 'center',
    lineHeight: '56px',
    fontSize: '1.1rem',
    padding: 1,
    maxWidth: 250,
  },

  companyName: {
    marginLeft: 12,
    fontFamily: 'HelveticaNeueBold,Helvetica,Arial,sans-serif',
    width: 'auto',
    height: 'auto',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '2.2rem',
    lineHeight: '19px',
    marginBottom: 5,
    color: '#404040',
    paddingTop: 1,
    paddingBottom: 3
  },

  a: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
  },

  container: {
    background: '#f3f5fa',
    padding: '15px 30px',
    display: 'flex',
    alignItems: 'center',
  }

} ;

const logoAlt = (
    <div style={styles.logoAlt}>
      <span>Logo</span>
     </div>
);

export default Heading;
