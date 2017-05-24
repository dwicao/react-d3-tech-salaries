import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import Preloader from './components/Preloader';
import CountyMap from './components/CountyMap';
import Histogram from './components/Histogram';
import { loadAllData } from './DataHandling';

import './App.css';

class App extends Component {
  state = {
    techSalaries: [],
    countyNames: [],
    medianIncomes: [],
  }

  componentWillMount() {
    loadAllData(data => this.setState(data));
  }

  countyValue(county, techSalariesMap) {
    const medianHousehold = this.state.medianIncomes[county.id];
    const salaries = techSalariesMap[county.name];

    if (!medianHousehold || !salaries) return null;

    const median = d3.median(salaries, d => d.base_salary);

    return {
      countyID: county.id,
      value: median - medianHousehold.medianIncome,
    };
  }

  render() {
    const {
      techSalaries,
      countyNames,
      usTopoJson,
      USstateNames,
    } = this.state;

    if (techSalaries.length < 1) return <Preloader />;

    const filteredSalaries = techSalaries;
    const filteredSalariesMap = _.groupBy(filteredSalaries, 'countyID');
    const countyValues = countyNames.map(
      county => this.countyValue(county, filteredSalariesMap)
    ).filter(d => !_.isNull(d));

    let zoom = null;

    return (
      <div className="App container">
        <svg width="1100" height="500">
          <CountyMap
            usTopoJson={usTopoJson}
            USstateNames={USstateNames}
            values={countyValues}
            x={0}
            y={0}
            width={500}
            height={500}
            zoom={zoom}
          />
          <Histogram
            bins={10}
            width={500}
            height={500}
            x="500"
            y="10"
            data={filteredSalaries}
            axisMargin={83}
            bottomMargin={5}
            value={d => d.base_salary}
          />
        </svg>
      </div>
    );
  }
}

export default App;
