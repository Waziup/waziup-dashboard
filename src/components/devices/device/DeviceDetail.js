import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router';
import DeviceNodeCard from './DeviceNodeCard';
import LocationForm from './LocationForm';
import {
  addSensor, deleteSensor, deleteDevice, getDevice, updateSensorName, 
  updateDeviceLocation, updateDeviceName, updateDeviceVisibility,
  addActuator, deleteActuator, updateActuatorName,
} from '../../../actions/actions.js';
import deviceImage from '../../../images/device.png';
import config from '../../../config';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class DeviceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { modalLocation: false };
  }

  componentWillMount() {
    this.props.getDevice(this.props.params.deviceId);
    this.interval = setInterval(() => {
      this.props.getDevice(this.props.params.deviceId);
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
        Device view is being loaded...
        {' '}
      </h1>
    );
    console.log(`sens:${JSON.stringify(this.props.device)}`);
    const device = this.props.device;
    console.log(device);
    if (device) {
      const position = device.location ? [
        device.location.latitude, device.location.longitude,
      ] : [
        12.238, -1.561,
      ];
      console.log(`pos:${JSON.stringify(position)}`);
      renderElement = (
        <Container fluid>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={deviceImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Device Details    
            </Typography>
          </Toolbar>
        </AppBar>
          <DeviceNodeCard
            className="deviceNode"
            deleteSensor={this.props.deleteSensor}
            deleteActuator={this.props.deleteActuator}
            deleteDevice={(sid) => {
              this.props.deleteDevice(sid); browserHistory.push('/devices');
            }}
            permission={this.props.permission}
            device={device}
            gateways={this.props.gateways}
            updateSensor={this.props.addSensor}
            updateActuator={this.props.addActuator}
            updateDeviceName={this.props.updateDeviceName}
            updateDeviceVisibility={this.props.updateDeviceVisibility}
            user={this.props.user}
          />
          <Card className="deviceMap">
            <Typography>
              <span className="Typography">
                {' '}
                Location
                {' '}
              </span>
              {this.props.permission && this.props.permission.scopes.includes('devices:update')
                ? 
                (<div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon onClick={() => { this.setState({ modalLocation: true }); }} />
                  </Hidden>
                  <Hidden smDown implementation="css">
                  <Button className="topRightButton" onTouchTap={() => { this.setState({ modalLocation: true }); }} variant="contained" color="primary" >Change</Button>
                  </Hidden>
                </div>) : null}
              <LocationForm
                handleClose={() => this.setState({ modalLocation: false })}
                initialLocation={device.location}
                modalOpen={this.state.modalLocation}
                onSubmit={l => this.props.updateDeviceLocation(device.id, l)}
                permission={this.props.permission}
              />
            </Typography>
            <CardMedia>
              <Map
                ref="map"
                center={position}
                zoom={5}
              >
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>
                    <span>
                      Device Position
                      <br />
                      {' '}
                      Latitude:
                      {position[0]}
                      {' '}
                      <br />
                      {' '}
                      Longitude:
                      {' '}
                      {position[1]}
                    </span>
                  </Popup>
                </Marker>
              </Map>
            </CardMedia>
          </Card>
        </Container>
      );
    } else {
      browserHistory.push('/devices');
    }

    return (
      <div className="device">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    device: state.device.device,
    gateways: state.gateways.gateways,
    permission: state.permissions.device.find(p => p.resource == ownProps.params.deviceId),
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDevice: (id) => {
      dispatch(getDevice(id));
    },
    addSensor: (id, m) => {
      dispatch(addSensor(id, m));
    },
    deleteSensor: (sid, mid) => {
      dispatch(deleteSensor(sid, mid));
    },
    addActuator: (id, m) => {
      dispatch(addActuator(id, m));
    },
    deleteActuator: (aid, mid) => {
      dispatch(deleteActuator(aid, mid));
    },
    deleteDevice: (id) => {
      dispatch(deleteDevice(id));
    },
    updateDeviceLocation: (id, l) => {
      dispatch(updateDeviceLocation(id, l));
    },
    updateDeviceName: (id, n) => {
      dispatch(updateDeviceName(id, n));
    },
    updateDeviceVisibility: (id, v) => {
      dispatch(updateDeviceVisibility(id, v));
    },
    updateSensorName: (deviceId, sensId, n) => {
      dispatch(updateSensorName(deviceId, sensId, n));
    },
    updateActuatorName: (deviceId, actuId, n) => {
      dispatch(updateActuatorName(deviceId, actuId, n));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetail);
