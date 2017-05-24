import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';

import Preloader from './components/Preloader';
import CountyMap from './components/CountyMap';
import { loadAllData } from './DataHandling';

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

    const filteredSalariesMap = _.groupBy(techSalaries, 'countyID');
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
        </svg>
      </div>
    );
  }
}

export default App;
