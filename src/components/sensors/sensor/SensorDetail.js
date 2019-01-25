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
import SensorNodeCard from './SensorNodeCard';
import LocationForm from './LocationForm';

import {
  addMeasurement, deleteMeasurement, deleteSensor, getSensor, updateMeasurementName, 
  updateSensorLocation, updateSensorName, updateSensorVisibility
} from '../../../actions/actions.js';
import sensorNodeImage from '../../../images/sensorNode.png';
import config from '../../../config';

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { modalLocation: false };
  }

  componentWillMount() {
    this.props.getSensor(this.props.params.sensorId);
    this.interval = setInterval(() => {
      this.props.getSensor(this.props.params.sensorId);
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
        Sensor view is being loaded...
        {' '}
      </h1>
    );
    console.log(`sens:${JSON.stringify(this.props.sensor)}`);
    const sensor = this.props.sensor;
    console.log(sensor);
    if (sensor) {
      const position = sensor.location ? [
        sensor.location.latitude, sensor.location.longitude,
      ] : [
        12.238, -1.561,
      ];
      console.log(`pos:${JSON.stringify(position)}`);
      renderElement = (
        <Container fluid>
          <h1 className="page-title">
            <img
              height="40"
              src={sensorNodeImage}
            />
            Sensor node
          </h1>
          <SensorNodeCard
            className="sensorNode"
            deleteMeasurement={this.props.deleteMeasurement}
            deleteSensor={(sid) => {
              this.props.deleteSensor(sid); browserHistory.push('/mysensors');
            }}
            permission={this.props.permission}
            sensor={sensor}
            updateMeasurement={this.props.addMeasurement}
            updateSensorName={this.props.updateSensorName}
            updateSensorVisibility={this.props.updateSensorVisibility}
            user={this.props.user}
          />
          <Card className="sensorMap">
            <Typography>
              <span className="Typography">
                {' '}
                Location
                {' '}
              </span>
              {this.props.permission && this.props.permission.scopes.includes('sensors:update')
                ? <Button className="topRightButton" onTouchTap={() => { this.setState({ modalLocation: true }); }} variant="contained" color="primary" >Change</Button> : null}
              <LocationForm
                handleClose={() => this.setState({ modalLocation: false })}
                initialLocation={sensor.location}
                modalOpen={this.state.modalLocation}
                onSubmit={l => this.props.updateSensorLocation(sensor.id, l)}
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
                      Sensor Position
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
      browserHistory.push('/sensors');
    }

    return (
      <div className="sensor">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    sensor: state.sensor.sensor,
    permission: state.permissions.permissions.find(p => p.resource == ownProps.params.sensorId),
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensor: (id) => {
      dispatch(getSensor(id));
    },
    addMeasurement: (id, m) => {
      dispatch(addMeasurement(id, m));
    },
    deleteMeasurement: (sid, mid) => {
      dispatch(deleteMeasurement(sid, mid));
    },
    deleteSensor: (id) => {
      dispatch(deleteSensor(id));
    },
    updateSensorLocation: (id, l) => {
      dispatch(updateSensorLocation(id, l));
    },
    updateSensorName: (id, n) => {
      dispatch(updateSensorName(id, n));
    },
    updateSensorVisibility: (id, v) => {
      dispatch(updateSensorVisibility(id, v));
    },
    updateMeasurementName: (sensorId, measId, n) => {
      dispatch(updateMeasurementName(sensorId, measId, n));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
