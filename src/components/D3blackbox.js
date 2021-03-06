import React, { Component } from 'react';

export default function D3blackbox(D3render) {
  return class Blackbox extends Component {
    componentDidMount() { 
      D3render.call(this);
    }

    componnetDidUpdate() {
      D3render.call(this);
    }

    render() {
      const { x, y } = this.props;

      return (
        <g transform={`translate(${x}, ${y})`} ref={el => this.anchor = el} />
      );
    }
  }
}