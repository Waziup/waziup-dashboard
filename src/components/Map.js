import React, { Component } from 'react';
import {
  Map as LeafletMap, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { getSensors } from '../actions/actions.js';

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      position: [
        14.4974, 14.4524,
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
    const markers = [];

    if (nextProps.sensors) {
      for (const sensor of nextProps.sensors) {
        if (sensor.location) {
          markers.push(<Marker
            key={sensor.id}
            position={[
              sensor.location.latitude, sensor.location.longitude,
            ]}
          >
            <Popup>
              <span>
                <a onClick={() => browserHistory.push(`/sensors/${sensor.id}`)}>
                  {' '}
                  {sensor.id}
                </a>
              </span>
            </Popup>
          </Marker>);
        }
        this.setState({ markers });
      }
    }
  }

  componentDidMount() {
    this.props.getSensors({ limit: 1000 });
  }

  render() {
    return (
      <div>
        <h1 className="page-title">
          {' '}
Map
          {' '}
        </h1>
        <Container fluid>
          <LeafletMap
            ref="map"
            center={this.state.position}
            zoom={5}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />
            {this.state.markers}
          </LeafletMap>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { sensors: state.sensors.sensors };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: (params) => {
      dispatch(getSensors(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
