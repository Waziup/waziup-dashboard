import React, { Component } from "react";
import PropTypes from "prop-types";
import deviceImage from "../../images/device.png";
import { Link } from "react-router";
import EditIcon from "@material-ui/icons/Edit";
import GatewayForm from "./GatewayForm.js";
import Tooltip from "@material-ui/core/Tooltip";
import Card from '@material-ui/core/Card';

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
      const card = sensors.push(card);
    }

    let deviceName =
      (device.name ? device.name + " " : "") + "(" + device.id + ")";
    let maxlimit = 15;

    return (
      <Card className="card">
        <GatewayForm
          device={device}
          modalOpen={this.state.modalEdit}
          handleClose={() => this.setState({ modalEdit: false })}
          onSubmit={s =>
            this.props.updateDeviceGatewayId(device.id, s.gateway_id)
          }
        />
        <div className="cardTitleIcons">
          {this.props.permission &&
          this.props.permission.scopes.includes("devices:update") ? (
            <EditIcon onClick={() => this.setState({ modalEdit: true })} />
          ) : null}
        </div>
        <Link to={"/devices/" + device.id}>
          <Tooltip title={deviceName}>
            <span className="Typography">
              Node{" "}
              {deviceName.length > maxlimit
                ? deviceName.substring(0, maxlimit - 3) + "..."
                : deviceName}{" "}
            </span>
          </Tooltip>
          <div className={"gatewayBoardIcon device" + device.id}>
            <img
              src={deviceImage}
              height="64"
              title={
                device.dateUpdated
                  ? "Last update at " + device.dateUpdated
                  : "No data yet"
              }
            />
          </div>
        </Link>
      </Card>
    );
  }

  static propTypes = {
    device: PropTypes.object.isRequired, //Should be a Waziup.Device
    updateDeviceGatewayId: PropTypes.func.isRequired,
    permission: PropTypes.object
  };
}
