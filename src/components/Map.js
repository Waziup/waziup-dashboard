import React, { Component } from 'react';
import {
  Map as LeafletMap, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { getDevices } from '../actions/actions.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import mapImage from '../images/map.png';
import Typography from '@material-ui/core/Typography';

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

    if (nextProps.devices) {
      for (const device of nextProps.devices) {
        if (device.location) {
          markers.push(<Marker
            key={device.id}
            position={[
              device.location.latitude, device.location.longitude,
            ]}
          >
            <Popup>
              <span>
                <a onClick={() => browserHistory.push(`/devices/${device.id}`)}>
                  {' '}
                  {device.id}
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
    this.props.getDevices({ limit: 1000 });
  }

  render() {
    return (
      <div>
          <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={mapImage} height="50"/>
            <Typography variant="h5" className="page-title">
            Map     
            </Typography>
          </Toolbar>
        </AppBar>
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
  return { devices: state.devices.devices };
}

function mapDispatchToProps(dispatch) {
  return {
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
