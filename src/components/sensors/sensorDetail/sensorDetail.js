import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getSensors } from "../../../actions/actions.js"
import Measurement from "../Measurement.js"

var position;

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.props.getSensors();
  }

  getMarkers(sensor) {
    var markers = [];
    if (sensor && sensor.location) {
      markers.push({
        position: [
          sensor.location.latitude,
          sensor.location.longitude
        ],
        defaultAnimation: 2,
      });
      position = markers[0].position;
    }
    return markers
  }
  
  formatDate(d) {
    return new moment(d).tz(moment.tz.guess()).format('H:mm a z MMMM Do YYYY')
  }

  render() {
    let renderElement = <h1> Sensor View is being loaded... </h1>;
    console.log("sens:" + JSON.stringify(this.props.sensor))
    if (this.props.sensor) {
      let markers = this.getMarkers(this.props.sensor);
      let sensorMap;
      if (markers.length > 0) {
        const listMarkers = markers.map((marker, index) =>
          <Marker key={index} position={marker.position}>
            <Popup>
              <span>Sensor Position <br /> {marker.position} </span>
            </Popup>
          </Marker>
        );

        if (listMarkers.length > 0) {
          sensorMap = <g>
            <CardMedia>
              <Map ref="map" center={position} zoom={5}>
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {listMarkers}
              </Map>
            </CardMedia>
          </g>
        }
      }
     
      var measurements = [];
      for(var m of this.props.sensor.measurements) {
        measurements.push(
          <Card className="measCard">
            <Measurement measurement={m}/>
          </Card>
        );
        
      }

      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor: {this.props.sensor.id}</h1>
          <Card>
            <CardTitle title="Current values" />
            {measurements}
            {measurements}
          </Card>
          <Card className="sensorMap">
            <CardTitle title="Sensor location" />
            {sensorMap}
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
    getSensors: () => {dispatch(getSensors()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
