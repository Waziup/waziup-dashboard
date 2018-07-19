import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SensorLineCard from './SensorLineCard.js'
import RaisedButton from 'material-ui/RaisedButton';

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
    let mySensors = this.props.sensors.filter(s => s.owner == this.props.user.username)
    return (
      <div> 
        <div className="section">
          <h1 className="sectionTitle"> My sensors </h1>
          {(mySensors.length != 0 ?
             mySensors.map(s => [React.createElement(Link, {to: "/sensors/" + s.id}, React.createElement(SensorLineCard, {className: "sensorNode", sensor: s, user: this.props.user}))]) :
             <h3> You don't have any sensors yet </h3>)
          }
          <RaisedButton className="addSensorButton" label="Add sensor node" primary={true} onTouchTap={() => this.props.addSensor()} />
        </div>
        <div className="section">
          <h1 className="sectionTitle"> All sensors </h1>
          {this.getDomains().map(d => [ 
            React.DOM.h2({className: "sectionTitle"}, "Domain " + d.domainName),
            d.sensors.map(s => [
              React.createElement(Link, {to: "/sensors/" + s.id},
                React.createElement(SensorLineCard, {className: "sensorNode", sensor: s, user: this.props.user})
              )
            ])
          ])}
        </div>
      </div>
    )
  }

  propTypes = {
    sensors: PropTypes.object.isRequired, //Should be a list of Waziup.Sensor
    user: PropTypes.object.isRequired,
    addSensor: PropTypes.func
  }
}
