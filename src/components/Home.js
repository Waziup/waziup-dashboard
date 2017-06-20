import React, {Component} from 'react';
import Checkbox from 'material-ui/Checkbox';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Container} from 'react-grid-system'
import {ToastContainer,ToastMessage} from "react-toastr"
import { connect } from 'react-redux';
import { fetchSensors} from '../actions/actions'
import {loadSensors} from "../index.js"
import UTILS from '../utils.js';

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      sensors : props.sensors,
      user:props.user,
      markers: [],
      position: [12.238, -1.561],
      isAllSensors: true,
    };

    loadSensors(true);
  }

  defaultProps = {
    sensors: []
  };

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

  componentWillReceiveProps(nextProps){

    if(this.props.user.preferred_username === 'watersense'){
      this.setState({position: [31.58, 74.32]});
    } else {
      this.setState({position: [12.238, -1.561]});
    }


    var markers = [];
    if (nextProps.sensors) {
        for (let sensor of nextProps.sensors) {

          if(sensor.location && sensor.location.value && sensor.location.value.coordinates){
            markers.push({
              position:[
                sensor.location.value.coordinates[1],
                sensor.location.value.coordinates[0]
              ],
              name: sensor.id,
              values: UTILS.getSensorData(sensor),
              defaultAnimation: 2,
            });
          }
        }

        console.log(JSON.stringify(markers));
        this.setState({markers:markers})
    }
  }

  componentWillMount(){
    if (this.props.user) {
        this.setState({user:this.props.user});
    }
  }

  componentDidMount(prevProps, prevState) {
     this.addAlert();
  }

  handleChangeAllSensors = (event) => {
     loadSensors(event.target.checked);
     this.setState({isAllSensors: event.target.checked});
  }

  render() {
    const listMarkers = this.state.markers.map((marker,index) =>
            <Marker key={index} position={marker.position}>
              <Popup>
                <span>
                   <a href={"/sensors/" + marker.name}> {marker.name} </a>
                   {marker.values}
                </span>
              </Popup>
            </Marker>
    );
    return (
      <div>
        <h1 className="page-title">Dashboard</h1>
        <Container fluid={true}>
          <Checkbox
              label="All sensor"
              checked={this.state.isAllSensors}
              onCheck={(evt)=>{this.handleChangeAllSensors(evt)}}
          />

           <Map ref="map" center={this.state.position} zoom={5}>
            <TileLayer
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {listMarkers}
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
      sensors : state.sensors.sensors,
      user: state.keycloak.idTokenParsed,
      keycloak: state.keycloak,
      currentUser:state.currentUser.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
      fetchSensors:(service, servicePath)=>{dispatch(fetchSensors(service, servicePath))}
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);

