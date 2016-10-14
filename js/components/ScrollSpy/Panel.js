import React, { PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import getOffset from 'dom-helpers/query/offset';

export default class Panel extends React.Component {
  static displayName = 'ScrollSpy.Panel';

  static childContextTypes = {
    $scrollSpy: PropTypes.shape({
      anchor: PropTypes.func,
      activeTarget: PropTypes.string,
    }),
  };

  state = { activeTarget: null };

  getChildContext() {
    return {
      $scrollSpy: {
        anchor: (name, node) => {
          this._anchors.set(name, node);
          this.handleScroll();
        },
        activeTarget: this.state.activeTarget,
      },
    };
  }

  componentWillMount(){
    this._anchors = new Map();
  }

  componentDidMount() {
    this.container = findDOMNode(this);
    this.container.addEventListener('scroll', this.handleScroll, false);
  }

  componentWillUnmount() {
    this.container.removeEventListener('scroll', this.handleScroll, false);
  }

  render() {
    return (
      this.props.children
    );
  }

  handleScroll = () => {
    cancelAnimationFrame(this._rafID)
    this._rafID = requestAnimationFrame(() => {
        this.update();
    });
  };

  update() {
    let scrollTop = this.container.scrollTop;
    let current = this.state.activeTarget;

    let nodes = Array
      .from(this._anchors.entries())
      .map(([name, node]) => {
        return [name, getOffset(node).top]
      })
      .sort((a, b) => a[1] - b[1]);

    for (let i = 0; i < nodes.length; i++) {
      let [name, offset] = nodes[i];
      let next = nodes[i + 1];

      if (current !== name && scrollTop >= offset && (!next || scrollTop < next[1])) {
        this.setState({ activeTarget: name });
        break;
      }
    }
  }
}

