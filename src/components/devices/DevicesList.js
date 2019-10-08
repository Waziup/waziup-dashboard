import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import DeviceLineCard from './DeviceLineCard.js';
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
        { this.props.domain ?  
          <h2> Domain {((this.props.domain).length > maxlimit) ? 
            (((this.props.domain).substring(0, maxlimit - 3)) + '...') : this.props.domain} </h2>
          : ''}
        </Hidden>
        <Hidden smDown implementation="css">
          <h2 > Domain {this.props.domain} </h2>
        </Hidden>
      </div>
    )
  }
}

export default class DevicesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getDomains = () => {
    var domains = []
    var domainNames = [...new Set(this.props.devices.map(s => s.domain))]

    for (var domain of domainNames) {
      let devices = this.props.devices.filter(s => s.domain == domain)
      domains.push({ domainName: domain, devices: devices })
    }
    return domains
  }

  render() {
    return (
      <div className="section">
        <h1 className="sectionTitle"> All devices </h1>
        {this.props.settings.allowManualCreateResources? <Button variant="contained" color="primary" className="addDeviceButton" onTouchTap={() => this.props.addDevice()} >Add a device</Button>: null}
        {this.getDomains().length != 0 ? this.getDomains().map((d, index) => [
          React.createElement(DomainNameComponent, { key: { index }, domain: d.domainName }),
          d.devices.map(s => [
            React.createElement(Link, { to: "/devices/" + s.id, key: { index } },
              React.createElement(DeviceLineCard, { className: "deviceNode", device: s, user: this.props.user, key: { index } })
            )
          ])
        ]) : 'Your filter did not match any devices'}
      </div>
    )
  }

  static propTypes = {
    devices: PropTypes.array.isRequired, //Should be a list of Waziup.Device
    user: PropTypes.object.isRequired,
    addDevice: PropTypes.func,
    settings: PropTypes.object
  }
}
