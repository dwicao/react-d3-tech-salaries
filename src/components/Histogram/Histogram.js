import React, { Component } from 'react';
import * as d3 from 'd3';

import HistogramBar from './HistogramBar';

class Histogram extends Component {
  constructor(props) {
    super(props);

    this.histogram = d3.histogram();
    this.widthScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();

    this.updateD3(props);

    this.makeBar = this.makeBar.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.histogram
        .thresholds(props.bins)
        .value(props.value);

    const bars = this.histogram(props.data);
    const counts = bars.map(d => d.length);

    this.widthScale
        .domain([d3.min(counts), d3.max(counts)])
        .range([0, props.width - props.axisMargin]);

    this.yScale
        .domain([0, d3.max(bars, (d) => d.x1)])
        .range([0, props.height - props.bottomMargin]);
  }

  makeBar(bar) {
    const { data, axisMargin } = this.props;

    let percent = bar.length / data.length * 100;

    let props = {
      x: axisMargin,
      y: this.yScale(bar.x0),
      width: this.widthScale(bar.length),
      height: this.yScale(bar.x1 - bar.x0),
      key: `histogram-bar-${bar.x0}`,
      percent,
    };

    return <HistogramBar {...props} />;
  }
  
  render() {
    const { data, x, y } = this.props;

    const translate = `translate(${x}, ${y})`;
    const bars = this.histogram(data);

    return (
      <g className="histogram" transform={translate}>
        <g className="bars">
          {bars.map(this.makeBar)}
        </g>
      </g>
    );
  }
}

export default Histogram;
