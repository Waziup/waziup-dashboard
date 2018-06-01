import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SensorLineCard from './SensorLineCard.js'

export default class SensorsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  getDomains = () => {
    var domains = []
    var domainNames = [...new Set(this.props.sensors.map(s => s.domain))]

    for(var domain of domainNames) {
      let sensors = this.props.sensors.filter(s => s.domain == domain)
      domains.push({domainName: domain, sensors: sensors})
    }
    return domains
  }

  render() {
    let sensor = this.props.sensor;
    return (
      React.DOM.div(null, 
        this.getDomains().map(d => [ 
          React.DOM.h2({className: "sectionTitle"}, "Domain " + d.domainName),
          d.sensors.map(s => [
            React.createElement(Link, {to: "/sensors/" + s.id},
              React.createElement(SensorLineCard, {className:"sensorNode", sensor:s})
            )
          ])
        ])
      )
    )
  }

  propTypes = {
    sensors: PropTypes.object.isRequired, //Should be a list of Waziup.Sensor
  }
}
