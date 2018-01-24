import { Link } from 'react-router';
import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { Container } from 'react-grid-system'
import { ToastContainer, ToastMessage } from "react-toastr"
import { connect } from 'react-redux';
import { getSensors } from "../actions/actions.js"
import UTILS from '../lib/utils.js';
import { icon } from 'leaflet';
import { browserHistory } from 'react-router';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
//14.4974° N, 14.4524
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      position: [14.4974, 14.4524],
    };
  }

  addAlert() {
    var now = new Date().toUTCString();
    this.refs.toastContainer.success(
      <div>
        <h3>Welcome {this.state.user.name} !</h3>
        <p>{now}</p>
      </div>,
      `WAZIUP`, {
        closeButton: true,
      });
  }

  goTo(uri) {
    browserHistory.push(uri);
  }

  componentWillReceiveProps(nextProps) {
    var markers = [];

    if (nextProps.sensors) {
      for (let sensor of nextProps.sensors) {
        if (sensor.location) {
          markers.push(<Marker key={sensor.id} position={[sensor.location.latitude, sensor.location.longitude]}>
              <Popup>
                <span>
                  <a onClick={() => this.goTo("/sensors/" + sensor.id)} > {sensor.id}</a>
                  {UTILS.getSensorData(sensor)}
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
  }

  render() {
    return (
      <div>
        <h1 className="page-title">Dashboard</h1>
        <Container fluid={true}>
          <Map ref="map" center={this.state.position} zoom={5}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.state.markers}
          </Map>
        </Container>
        <ToastContainer
          toastMessageFactory={ToastMessageFactory}
          ref="toastContainer"
          className="toast-top-right"
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    user: state.keycloak.idTokenParsed,
    keycloak: state.keycloak,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: () => { dispatch(getSensors()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
