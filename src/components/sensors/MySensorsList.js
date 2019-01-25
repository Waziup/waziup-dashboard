import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SensorLineCard from './SensorLineCard.js'
import Button from '@material-ui/core/Button';

export default class MySensorsList extends Component {
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
    let mySensors = this.props.sensors.filter(s => s.owner == this.props.user.username)
    return (
      <div className="section">
        <h1 className="sectionTitle"> My sensors </h1>
        {(mySensors.length != 0 ?
            mySensors.map((s,index) => [React.createElement(Link, {to: "/sensors/" + s.id,key:{index}}, React.createElement(SensorLineCard, {className: "sensorNode", sensor: s, user: this.props.user,key:{index}}))]) :
            <h3> You don't have any sensors yet </h3>)
        }
        <Button variant="contained" color="primary" className="addSensorButton" onTouchTap={() => this.props.addSensor()} >Add sensor node</Button>
      </div>
    )
  }

  static propTypes = {
    sensors: PropTypes.array.isRequired, //Should be a list of Waziup.Sensor
    user: PropTypes.object.isRequired,
    addSensor: PropTypes.func
  }
}
