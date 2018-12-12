import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SensorLineCard from './SensorLineCard.js'
import DOM from 'react-dom-factories';

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
    return (
        <div className="section">
          <h1 className="sectionTitle"> All sensors </h1>
          {this.getDomains().map((d,index) => [ 
            DOM.h2({className: "sectionTitle",key:{index}}, "Domain " + d.domainName),
            d.sensors.map(s => [
              React.createElement(Link, {to: "/sensors/" + s.id,key:{index}},
                React.createElement(SensorLineCard, {className: "sensorNode", sensor: s, user: this.props.user,key:{index}})
              )
            ])
          ])}
        </div>
    )
  }

  static propTypes = {
    sensors: PropTypes.array.isRequired, //Should be a list of Waziup.Sensor
    user: PropTypes.object.isRequired,
    addSensor: PropTypes.func
  }
}
