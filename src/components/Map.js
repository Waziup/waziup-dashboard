import { Link } from 'react-router';
import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { Map as LeafletMap, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { Container } from 'react-grid-system'
import { connect } from 'react-redux';
import { getSensors, getPermissions } from "../actions/actions.js"
import UTILS from '../lib/utils.js';
import { icon } from 'leaflet';
import { browserHistory } from 'react-router';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      position: [14.4974, 14.4524],
    };
  }

  componentWillReceiveProps(nextProps) {
    var markers = [];

    if (nextProps.sensors) {
      for (let sensor of nextProps.sensors) {
        if (sensor.location) {
          markers.push(<Marker key={sensor.id} position={[sensor.location.latitude, sensor.location.longitude]}>
              <Popup>
                <span>
                  <a onClick={() => this.browserHistory.push("/sensors/" + sensor.id)} > {sensor.id}</a>
                </span>
              </Popup>
            </Marker>
          );
        }
        this.setState({ markers: markers })
      }
    }
  }

  componentDidMount() {
    this.props.getSensors();
    this.props.getPermissions();
  }

  render() {
    return (
      <div>
        <h1 className="page-title"> Map </h1>
        <Container fluid={true}>
          <LeafletMap ref="map" center={this.state.position} zoom={5}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.state.markers}
          </LeafletMap>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: () => { dispatch(getSensors()) },
    getPermissions: () => { dispatch(getPermissions()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
