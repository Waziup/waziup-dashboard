import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import SensorForm from './sensor/SensorForm';
import SensorCard from './sensor/SensorCard';
import ActuatorForm from './actuator/ActuatorForm';
import ActuatorCard from './actuator/ActuatorCard';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import deviceNodeImage from '../../../images/device.png';
import DeviceForm from './DeviceForm.js';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default class DeviceNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddSensor: false,
      modalAddActuator: false,
      modalEdit: false
    };
  }

  deleteMsg = 'Delete a device?\nWARNING: all the data attached to that device will be lost (sensors, actuators, datapoints history)!'

  render() {
    let device = this.props.device;
    var sensors = [];
    var actuators = [];
    for (let m of device.sensors) {
      const card = <SensorCard key={m.id}
        sensor={m}
        isDetails={false}
        updateSensor={this.props.updateSensor}
        deleteSensor={this.props.deleteSensor}
        deviceId={device.id}
        permission={this.props.permission} />
      sensors.push(card);
    }
    if(device.actuators)
    for (let m of device.actuators) {
      const card = <ActuatorCard key={m.id}
        actuator={m}
        isDetails={false}
        updateActuator={this.props.updateActuator}
        deleteActuator={this.props.deleteActuator}
        deviceId={device.id}
        permission={this.props.permission} />
      actuators.push(card);
    }
    console.log("perms:" + JSON.stringify(this.props.permission))
    return (
      <Card className="deviceNode">
        <SensorForm modalOpen={this.state.modalAddSensor}
          handleClose={() => { this.setState({ modalAddSensor: false }) }}
          onSubmit={(m) => {
            this.props.updateSensor(device.id, m);
            this.setState({ modalAddSensor: false });
          }}
          isEdit={false} />
        <ActuatorForm modalOpen={this.state.modalAddActuator}
        handleClose={() => { this.setState({ modalAddActuator: false }) }}
        onSubmit={(m) => {
          this.props.updateActuator(device.id, m);
          this.setState({ modalAddActuator: false });
        }}
        isEdit={false} />
        <DeviceForm device={device}
          gateways={this.props.gateways}
          isEdit={true}
          modalOpen={this.state.modalEdit}
          handleClose={() => this.setState({ modalEdit: false })}
          onSubmit={s => {
            this.props.updateDeviceName(device.id, s.name),
            this.props.updateDeviceVisibility(device.id, s.visibility)
            this.props.updateDeviceGatewayId(device.id, s.gateway_id)
          }} />
        <Grid container direction="row" justify="flex-start" spacing={24}>
          <Grid item md={12} lg={6}>
            <span className="Typography"> {(device.name ? device.name + " " : "") + "(" + device.id + ")"} </span>
          </Grid>
          <Grid item md={12} lg={6}>
            <Typography>
              {this.props.permission && this.props.permission.scopes.includes("devices:delete") ?
              (<div className="cardTitleIcons">
                <Hidden mdUp implementation="css">
                  <DeleteIcon onClick={() => { if (window.confirm(this.deleteMsg)) this.props.deleteDevice(device.id) }} />
                </Hidden>
                <Hidden smDown implementation="css">
                <Button
                  className="topRightButton"
                  variant="contained"
                  color="primary"
                  onTouchTap={() => { if (window.confirm(this.deleteMsg)) this.props.deleteDevice(device.id) }}>Delete</Button>
                </Hidden>
              </div>) : null}
              {this.props.permission && this.props.permission.scopes.includes("devices:update") ?
              (<div className="cardTitleIcons">
                <Hidden mdUp implementation="css">
                  <AddCircleIcon onClick={() => { this.setState({ modalAddActuator: true }) }} />
                </Hidden>
                <Hidden smDown implementation="css">
                <Button
                  className="topRightButton"
                  variant="contained"
                  color="primary"
                  onTouchTap={() => { this.setState({ modalAddActuator: true }) }}>Add actuator</Button> 
                </Hidden>
              </div>) : null}
              {this.props.permission && this.props.permission.scopes.includes("devices:update") ?
              (<div className="cardTitleIcons">
                <Hidden mdUp implementation="css">
                  <AddCircleIcon onClick={() => { this.setState({ modalAddSensor: true }) }} />
                </Hidden>
                <Hidden smDown implementation="css">
                <Button
                  className="topRightButton"
                  variant="contained"
                  color="primary"
                  onTouchTap={() => { this.setState({ modalAddSensor: true }) }}>Add sensor</Button> 
                </Hidden>
              </div>) : null}
              {this.props.permission && this.props.permission.scopes.includes("devices:update") ?
                (<div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon onClick={() => this.setState({ modalEdit: true })} />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => { this.setState({ modalEdit: true }) }}>Edit</Button>
                  </Hidden>
                </div>) : null}
            </Typography>
          </Grid>
        </Grid>

        <div className="contentCards">
          <div className="boardIcon">
            <img src={deviceNodeImage} height="75" title={device.dateUpdated ? "Last update at " + device.dateUpdated : "No data yet"} />
            <pre> {device.owner ? "owner: " + device.owner + (this.props.user && device.owner == this.props.user.username ? " (you)" : "") : ""} </pre>
            <pre> {"visibility: " + (device.visibility ? device.visibility : "public")} </pre>
            <pre> {"domain: " + (device.domain ? device.domain : "none")} </pre>
          </div>
          {sensors}
          {actuators}
        </div>
      </Card>
    );
  }

  static propTypes = {
    device: PropTypes.object.isRequired, //Should be a Waziup.Device
    updateDevice: PropTypes.func,
    deleteDevice: PropTypes.func,
    updateSensor: PropTypes.func,
    deleteSensor: PropTypes.func,
    updateActuator: PropTypes.func,
    deleteActuator: PropTypes.func,
    permission: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }
}
