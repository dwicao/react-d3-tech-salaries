import React, { Component } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson';
import _ from 'lodash';

import County from './County';

class CountyMap extends Component {
  constructor(props) {
    super(props);

    this.projection = d3.geoAlbersUsa()
                        .scale(1280);
    this.geoPath = d3.geoPath()
                     .projection(this.projection);
    this.quantize = d3.scaleQuantize()
                      .range(d3.range(9));

    this.updateD3(props);
  }

  componentWillReceiveProps(newProps) {
    this.updateD3(newProps);
  }

  updateD3(props) {
    this.projection
        .translate([props.width / 2, props.height / 2])
        .scale(props.width * 1.3);

    if (props.zoom && props.usTopoJson) {
      const us = props.usTopoJson;
      const statePaths = topojson.feature(us, us.objects.states).features;
      const id = _.find(props.USstateNames, { code: props.zoom }).id;

      this.projection.scale(props.width * 4.5);

      const centroid = this.geoPath.centroid(_.find(statePaths, { id }));
      const translate = this.projection.translate();

      this.projection.translate([
        translate[0] - centroid[0] + props.width / 2,
        translate[1] - centroid[1] + props.height / 2,
      ]);
    }

    if (props.values) {
      this.quantize.domain([
        d3.quantile(props.values, 0.15, d => d.value),
        d3.quantile(props.values, 0.85, d => d.value),
      ]);
    }
  }

  render() {
    const { usTopoJson, values, x, y, zoom } = this.props;

    if (!usTopoJson) return null;

    const us = usTopoJson;
    const statesMesh = topojson.mesh(us, us.objects.states, (a, b) => a !== b);
    const counties = topojson.feature(us, us.objects.counties).features;
    const countyValueMap = _.fromPairs(values.map(d => [d.countyID, d.value]));

    return (
      <g transform={`translate(${x}, ${y})`}>
        {counties.map(feature => (
          <County
            geoPath={this.geoPath}
            feature={feature}
            zoom={zoom}
            key={feature.id}
            quantize={this.quantize}
            value={countyValueMap[feature.id]}
          />
        ))}

        <path
          d={this.geoPath(statesMesh)}
          style={{
            fill: 'none',
            stroke: '#fff',
            strokeLineJoin: 'round',
          }}
        />
      </g>
    );
  }
}

export default CountyMap;
