import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Container, Row, Col, Visible, Hidden, ScreenClassRender } from 'react-grid-system'
import {ToastContainer,ToastMessage} from "react-toastr"
import { connect } from 'react-redux';
import { adminLogin ,fetchSensors} from '../actions/actions'
import FullWidthSection from './FullWidthSection'
import Page from '../App'

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class Home extends Component {
  constructor(props){
    super(props);


    this.state = {
      sensors : props.sensors,
      user:props.user,
      markers: [],
      position: [12.238, -1.561]
    };
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
        for (var i = 0; i < nextProps.sensors.length; i++) {
          if(nextProps.sensors[i].location && nextProps.sensors[i].location.value && nextProps.sensors[i].location.value.coordinates){
            markers.push({
              position:[
                nextProps.sensors[i].location.value.coordinates[1],
                nextProps.sensors[i].location.value.coordinates[0]
              ],
              name: nextProps.sensors[i].id,
              defaultAnimation: 2,
            });
          }
        } 

        console.log(JSON.stringify(markers));
        this.setState({markers:markers})
    }

    if (nextProps.currentUser !== this.props.currentUser){
      var service = nextProps.currentUser.attributes.Service? nextProps.currentUser.attributes.Service[0] : null;
      var servicePath = nextProps.currentUser.attributes.ServicePath[0];

      this.props.fetchSensors(service, servicePath);
    }

  }
  componentWillMount(){
    if (this.props.user) {
        this.setState({user:this.props.user});
    }
  }
  componentDidMount(prevProps, prevState) {
      this.addAlert();
      this.props.adminLogin(this.state.user);
  }

  render() {
    const listMarkers = this.state.markers.map((marker,index) =>
            <Marker key={index} position={marker.position}>
              <Popup>
                <span>{marker.name}</span>
              </Popup>
            </Marker>
    );    
    return (
      <div>
        <h1 className="page-title">Dashboard</h1>
        <Container fluid={true}>
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
      sensors : state.example.data,
      user: state.keycloak.idTokenParsed,
      keycloak: state.keycloak,
      currentUser:state.currentUser.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
      adminLogin:(user)=>{dispatch(adminLogin(user))},
      fetchSensors:(service, servicePath)=>{dispatch(fetchSensors(service, servicePath))}
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);

