import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import SensorNodeCard from './SensorNodeCard';
import SensorCard from './SensorCard';
import LocationForm from './LocationForm';
import MeasurementForm from './MeasurementForm';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getSensors, deleteSensor, updateSensorLocation, updateSensorName, updateMeasurementName, addMeasurement } from "../../../actions/actions.js"
import RaisedButton from 'material-ui/RaisedButton';
import sensorNodeImage from '../../../images/sensorNode.png';
import sensorImage from '../../../images/gauge.png';

var position;

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalLocation: false,
      modalMeas: false
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
      var measurements = sensor.measurements.map(m => <SensorCard name={m.name} changeName={n => this.props.updateMeasurementName(sensor.id, m.id, n)} value={m.last_value + " " + (m.unit? m.unit: null)} 
                                                                  image={sensorImage} lastUpdate={m.timestamp}/>);

      var position = [sensor.location.latitude, sensor.location.longitude]
      console.log("pos:" + JSON.stringify(position))
      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor node: {sensor.id}</h1>
          <SensorNodeCard className="sensorNode" sensor={sensor} updateSensorName={this.props.updateSensorName} updateMeasurementName={this.props.updateMeasurementName} 
                          deleteSensor={this.props.deleteSensor} addMeasurement={this.props.addMeasurement}/>
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
//
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
    deleteSensor: (id) => {dispatch(deleteSensor(id)) },
    updateSensorLocation: (id, l) => {dispatch(updateSensorLocation(id, l)) },
    updateSensorName: (id, n) => {dispatch(updateSensorName(id, n)) },
    updateMeasurementName: (sensorId, measId, n) => {dispatch(updateMeasurementName(sensorId, measId, n)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
