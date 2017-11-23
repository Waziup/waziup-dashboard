import { Link } from 'react-router';
import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import { Container } from 'react-grid-system'
import { ToastContainer, ToastMessage } from "react-toastr"
import { connect } from 'react-redux';
import { loadSensors } from "../api-adapter.js"
import UTILS from '../lib/utils.js';
import { icon } from 'leaflet';
import { browserHistory } from 'react-router';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);
//14.4974° N, 14.4524
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sensors: props.sensors,
      user: props.user,
      markers: [],
      farmsPolygon: [],
      position: [14.4974, 14.4524],
      isAllSensors: true
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
    let farmsPolygon = [];

    if (nextProps.sensors) {
      for (let sensor of nextProps.sensors) {
        if (!!sensor.location && !!sensor.location.value &&
          !!sensor.location.value.coordinates) {
          if (sensor.type === 'Farm') {
            const c = sensor.location.value.coordinates[0][0]
            //console.log('getCenter', sensor.location.value.coordinates.getBounds().getCenter());
            farmsPolygon.push(UTILS.convertLonLatToLatLon(sensor.location.value.coordinates));
            /*markers.push({
              position: [c[1], c[0]],
              name: sensor.name.value,
              values: UTILS.getFarmData(sensor),
              defaultAnimation: 2,
            });
            
             <a href={"/farmview/" + sensor.id} >
             <Link to={"/sensors/" + sensor.id}> {sensor.id} </Link>
            */

            /*          var greenIcon = icon({
                        iconUrl: '../images/leaf-green.png',
                        shadowUrl: '../images/leaf-shadow.png',
                        iconSize: [38, 95], // size of the icon
                        shadowSize: [50, 64], // size of the shadow
                        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                        shadowAnchor: [4, 62],  // the same for the shadow
                        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
                      });icon={greenIcon}
          */
            markers.push(<Marker key={sensor.id} position={[c[1], c[0]]}>
              <Popup>
                <span>
                  <a onClick={() => this.goTo("/farmview/" + sensor.id)} > {sensor.name.value} </a>
                  {UTILS.getFarmData(sensor)}
                </span>
              </Popup>
            </Marker>);
          } else {
            const c = sensor.location.value.coordinates
            markers.push(<Marker key={sensor.id} position={[c[1], c[0]]}>
              <Popup>
                <span>
                  <a onClick={() => this.goTo("/sensors/" + sensor.id)} > {sensor.id}</a>
                  {UTILS.getSensorData(sensor)}
                </span>
              </Popup>
            </Marker>);
          }
        }

        this.setState({ markers: markers })
        this.setState({ farmsPolygon: farmsPolygon })
      }
    }
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({ user: this.props.user });
    }
    this.props.loadSensors(this.state.isAllSensors, this.state.user);
  }

  /*componentDidMount(prevProps, prevState) {
    this.addAlert();
  }*/

  handleChangeAllSensors(event) {
    this.props.loadSensors(event.target.checked, this.state.user);
    this.setState({ isAllSensors: event.target.checked });
  }

  render() {
    const farmsPolygon = this.state.farmsPolygon.map((fp, index) =>
      <Polygon key={index} color="purple" positions={fp} />);

    return (
      <div>
        <h1 className="page-title">Dashboard</h1>
        <Container fluid={true}>
          <Checkbox
            label="All sensor"
            checked={this.state.isAllSensors}
            onCheck={(evt) => { this.handleChangeAllSensors(evt) }}
          />

          <Map ref="map" center={this.state.position} zoom={5}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {this.state.markers}
            {farmsPolygon}
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
    loadSensors: (isAllSensors, user) => { dispatch(loadSensors(isAllSensors, user)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
