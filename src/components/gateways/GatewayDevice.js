import React, { Component } from 'react';
import PropTypes from 'prop-types';
import deviceNodeImage from '../../images/device.png';
import config from '../../config';
import { Link } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';
import GatewayForm from './GatewayForm.js';
import Hidden from '@material-ui/core/Hidden';

export default class DeviceLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  render() {
    let device = this.props.device;
    var sensors = [];
    for (let m of device.sensors) {
      const card =
      sensors.push(card);
    }
    
    let activeStyle = (sens) => {return (sens.value && new Date() < Date.parse(sens.value.date_received) + config.delayDeviceActive)? "cardGreen": "cardRed"}
    let title = (sens) => {return sens.value ? "Date received: " + sens.value.date_received : "No data yet"}
    let deviceName = (device.name ? device.name + " " : "") + "(" + device.id + ")";
    let maxlimit = 20;

    return ( 
      <div className="deviceNode">
        <GatewayForm device={device}
                     modalOpen={this.state.modalEdit}
                     handleClose={() => this.setState({ modalEdit: false })}
                     onSubmit={s => this.props.updateDeviceGatewayId(device.id, s.gateway_id)} />
        {this.props.permission && this.props.permission.scopes.includes("devices:update")?
                  <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null}
        <Link to={'/devices/' + device.id}> 
          <Hidden mdUp implementation="css">
            <h2 className="Typography"> Node {((deviceName).length > maxlimit) ? (((deviceName).substring(0, maxlimit - 3)) + '...') : deviceName} </h2>
          </Hidden>
          <Hidden smDown implementation="css">
            <h2 className="Typography"> Node {deviceName} </h2>
          </Hidden>
          <div className={"gatewayBoardIcon device" + device.id}>
            <img src={deviceNodeImage} height="64" title={device.dateUpdated? "Last update at " + device.dateUpdated: "No data yet"}/>
          </div>
        </Link>
      </div>
    );
  }

  static propTypes = {
    device: PropTypes.object.isRequired, //Should be a Waziup.Device
    updateDeviceGatewayId: PropTypes.func.isRequired,
    permission: PropTypes.object
  }
}
