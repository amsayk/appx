import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export default class Anchor extends React.Component {
  static displayName = 'ScrollSpy.Anchor';

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  static contextTypes = {
    $scrollSpy: PropTypes.shape({
      anchor: PropTypes.func,
      activeTarget: PropTypes.any,
    }),
  };

  componentDidMount() {
    this.context.$scrollSpy.anchor(this.props.id, findDOMNode(this));
  }

  render() {
    return React.cloneElement(
      this.props.children, { activeTarget: this.context.$scrollSpy.activeTarget }
    );
  }
}

