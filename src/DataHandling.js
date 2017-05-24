import * as d3 from 'd3';
import _ from 'lodash';

const cleanIncomes = (d) => ({
  countyName: d['Name'],
  USstate: d['State'],
  medianIncome: Number(d['Median Household Income']),
  lowerBound: Number(d['90% CI Lower Bound']),
  upperBound: Number(d['90% CI Upper Bound']),
});

const dateParse = d3.timeParse('%m/%d/%Y');

const cleanSalary = (d) => {
  if (!d['base salary'] || Number(d['base salary']) > 300000) {
    return null;
  }

  return {
    employer: d.employer,
    submit_date: dateParse(d['submit date']),
    start_date: dateParse(d['start date']),
    case_status: d['case status'],
    job_title: d['job title'],
    clean_job_title: d['job title'],
    base_salary: Number(d['base salary']),
    city: d['city'],
    USstate: d['state'],
    county: d['county'],
    countyId: d['countyID'],
  };
};

const cleanUSStateName = (d) => ({
  code: d.code,
  id: Number(d.id),
  name: d.name,
});
