import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import GatewayCard from './GatewayCard.js'
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
    console.log("domainNames"+ JSON.stringify(domainNames))

    for(var domain of domainNames) {
      let sensors = this.props.sensors.filter(s => s.domain == domain)
      var gatewayIDs = [...new Set(sensors.map(s => s.gateway_id))]
      console.log("gateways"+ JSON.stringify(gatewayIDs))
      var gateways = gatewayIDs.map(g => {return {gatewayID: g, sensors: sensors.filter(s => s.gateway_id == g)}})
      domains.push({domainName: domain, gateways: gateways})
    }
    console.log("domains"+ JSON.stringify(domains))
    return domains
  }

  render() {
    let sensor = this.props.sensor;
    return (
      React.DOM.div(null, 
        this.getDomains().map(d => [ 
          React.DOM.h1(null, "Domain " + d.domainName),
          d.gateways.map(g => [
            React.createElement(GatewayCard, {gatewayID: g.gatewayID}, 
              g.sensors.map(s => [
                React.createElement(Link, {to: "/sensors/" + s.id},
                  React.createElement(SensorLineCard, {className:"sensorNode", sensor:s}))
              ])
            )
          ])
        ])
      )
    );
  }

  propTypes = {
    sensors: PropTypes.object.isRequired, //Should be a list of Waziup.Sensor
  }
}
