import React, {} from 'react';

export default class extends React.PureComponent {
  static displayName = `VAT`;

  static propTypes = {

  };
  static contextTypes = {

    joyride: React.PropTypes.shape({
      addSteps: React.PropTypes.func.isRequired,
      removeSteps: React.PropTypes.func.isRequired,
      addTooltip: React.PropTypes.func.isRequired,
    }).isRequired
  }
  componentDidMount(){


  }
  componentWillUnmount() {
    const { type : name } = this.props;
    this.context.joyride.removeSteps([
      `form-${name}-1`
    ]);
  }

  render(){
    const { Wrapper, ...props } = this.props;
    return (
      <Wrapper {...props}>
        <div className={'TODO'}></div>
      </Wrapper>
    );
  }
}


