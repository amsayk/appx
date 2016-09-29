import React, {} from 'react';

export default class Loader extends React.PureComponent{
  static propTypes = {
    children: React.PropTypes.func.isRequired,
  };
  static defaultProps = {
    children: (Component, props) => <Component {...props}/>
  }
  state = {
    Component: null,
  }
  componentWillMount(){
    const self = this;
    this.props.load(function (Component) {
      self.setState({ Component });
    })
  }
  render(){
    const { Component } = this.state;
    return Component && this.props.children(Component, this.props);
  }
}
