import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import SensorCard from './SensorCard';
import LocationForm from './LocationForm';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getSensors, updateSensorLocation, updateSensorName } from "../../../actions/actions.js"
import MeasurementCard from "./measurement/MeasurementCard.js"
import RaisedButton from 'material-ui/RaisedButton';

var position;

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalLocation: false
    };
  }

  componentDidMount() {
    this.props.getSensors();
  }
  
  render() {
    let renderElement = <h1> Sensor View is being loaded... </h1>;
    console.log("sens:" + JSON.stringify(this.props.sensor))
    let sensor = this.props.sensor;
    if (this.props.sensor) {
      var measurements = sensor.measurements.map(m => <MeasurementCard measurement={m}/>);
      var position = [sensor.location.latitude, sensor.location.longitude]
      console.log("pos:" + JSON.stringify(position))
      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor: {sensor.id}</h1>
          <Card className="sensorNode">
            <CardTitle title="Sensor node" />
            <div>
              <SensorCard sensor={sensor} changeName={n => this.props.updateSensorName(sensor.id, n)}/>
            </div>
            <div>
              {measurements}
              {measurements}
            </div>
          </Card>
          <Card className="sensorMap">
            <CardTitle title="Location">
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
    updateSensorLocation: (id, l) => {dispatch(updateSensorLocation(id, l)) },
    updateSensorName: (id, n) => {dispatch(updateSensorName(id, n)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
