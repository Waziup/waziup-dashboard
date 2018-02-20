import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import SensorNodeCard from './SensorNodeCard';
import LocationForm from './LocationForm';
import MeasurementForm from './MeasurementForm';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getSensors, deleteSensor, updateSensorLocation, updateSensorName, updateMeasurementName, addMeasurement, deleteMeasurement } from "../../../actions/actions.js"
import RaisedButton from 'material-ui/RaisedButton';

var position;

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalLocation: false,
    };
  }

  componentDidMount() {
    this.props.getSensors();
  }
  
  render() {
    let renderElement = <h1> Sensor View is being loaded... </h1>;
    console.log("sens:" + JSON.stringify(this.props.sensor))
    let sensor = this.props.sensor;
    if (sensor) {
      var position = (sensor.location? [sensor.location.latitude, sensor.location.longitude]: [12.238, -1.561]);
      console.log("pos:" + JSON.stringify(position))
      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor node: {sensor.id}</h1>
          <SensorNodeCard className="sensorNode"
                          sensor={sensor}
                          updateSensor={s => this.props.updateSensorName(s.id, s.name)}
                          deleteSensor={this.props.deleteSensor}
                          updateMeasurement={m => this.props.addMeasurement(sensor.id, m)}
                          deleteMeasurement={id => this.props.deleteMeasurement(sensor.id, id)}
                          isEditable={true}/>
          <Card className="sensorMap">
            <CardTitle>
              <h2 className="sensorNodeTitle"> Location </h2>
              <RaisedButton label="Change..." labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.setState({modalLocation: true})}}/>
              <LocationForm initialLocation={sensor.location} modalOpen={this.state.modalLocation} 
                            onSubmit={(l) => this.props.updateSensorLocation(sensor.id, l)} handleClose={() => this.setState({modalLocation: false})}/>
            </CardTitle>
            <CardMedia>
              <Map ref="map" center={position} zoom={5}>
                <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                <Marker position={position}>
                  <Popup>
                    <span>Sensor Position <br/> Latitude: {position[0]} <br/> Longitude: {position[1]}</span>
                  </Popup>
                </Marker>
              </Map>
            </CardMedia>
          </Card>
        </Container>
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
      sensor: state.sensors.sensors.find((el) => (el.id === ownProps.params.sensorId)),
      user: state.keycloak.idTokenParsed
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: () => {dispatch(getSensors()) },
    addMeasurement: (id, m) => {dispatch(addMeasurement(id, m)) },
    deleteMeasurement: (sid, mid) => {dispatch(deleteMeasurement(sid, mid)) },
    deleteSensor: (id) => {dispatch(deleteSensor(id)) },
    updateSensorLocation: (id, l) => {dispatch(updateSensorLocation(id, l)) },
    updateSensorName: (id, n) => {dispatch(updateSensorName(id, n)) },
    updateMeasurementName: (sensorId, measId, n) => {dispatch(updateMeasurementName(sensorId, measId, n)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
