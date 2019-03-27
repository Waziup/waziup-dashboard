import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import SensorLineCard from './SensorLineCard.js';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';

class DomainNameComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let maxlimit = 20;
    return (
      <div>
        <Hidden mdUp implementation="css">
          <h2> Domain {((this.props.domain).length > maxlimit) ? (((this.props.domain).substring(0, maxlimit - 3)) + '...') : this.props.domain} </h2>
        </Hidden>
        <Hidden smDown implementation="css">
          <h2 > Domain {this.props.domain} </h2>
        </Hidden>
      </div>
    )
  }
}

export default class SensorsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getDomains = () => {
    var domains = []
    var domainNames = [...new Set(this.props.sensors.map(s => s.domain))]

    for (var domain of domainNames) {
      let sensors = this.props.sensors.filter(s => s.domain == domain)
      domains.push({ domainName: domain, sensors: sensors })
    }
    return domains
  }

  render() {
    return (
      <div className="section">
        <Button variant="contained" color="primary" className="addSensorButton" onTouchTap={() => this.props.addSensor()} >Add sensor node</Button>
        {this.getDomains().length != 0 ? this.getDomains().map((d, index) => [
          React.createElement(DomainNameComponent, { key: { index }, domain: d.domainName }),
          d.sensors.map(s => [
            React.createElement(Link, { to: "/sensors/" + s.id, key: { index } },
              React.createElement(SensorLineCard, { className: "sensorNode", sensor: s, user: this.props.user, key: { index } })
            )
          ])
        ]) : 'Your filter did not match any sensors'}
      </div>
    )
  }

  static propTypes = {
    sensors: PropTypes.array.isRequired, //Should be a list of Waziup.Sensor
    user: PropTypes.object.isRequired,
    addSensor: PropTypes.func
  }
}
