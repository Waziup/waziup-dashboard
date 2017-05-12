import axios from 'axios'
import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container, Col, Visible, Hidden } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import SensorChart from './SensorChart/SensorChartContainer';
import UTIL from '../../../utils.js';

var position = [12.238, -1.561];
class sensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensor: {},
      dateModified: "not available",
      dateCreated: "not available",
      servicePath: "/",
      service: "waziup",
      markers: [],
      id: this.props.params.sensorId,
      historicalData: {},
    };
  }

  defaultProps = {
    sensors: []
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.user.preferred_username === 'watersense'){
      this.setState({service: "watersense"});
    } else {
      this.setState({service: "waziup"});
    }
    if (nextProps.currentUser !== this.props.currentUser){
      this.props.fetchSensors(this.state.service, this.state.servicePath);
    }

    if (nextProps.sensors && this.props.params.sensorId) {
      var sensor = nextProps.sensors.find((el) => {
        return el.id === this.props.params.sensorId;
      });
      this.setState({ sensor: sensor });

      if (sensor.dateModified && sensor.dateModified.value) {
        this.setState({ dateModified: sensor.dateModified.value });
      }
      if (sensor.dateCreated && sensor.dateCreated.value) {
        this.setState({ dateCreated: sensor.dateCreated.value });
      }
      if (sensor.servicePath && sensor.servicePath.value) {
        this.setState({ servicePath: sensor.servicePath.value });
      }

      var markers = [];
      if (sensor.location && sensor.location.coordinates) {
        markers.push({
          position: [
            sensor.location.coordinates[1],
            sensor.location.coordinates[0]
          ],
          defaultAnimation: 2,
        });
      }
      position = markers[0].position;
      this.setState({ markers: markers })

    }
    var deviceID = 'Device_6';
    if (this.props.params.sensorId)
      var deviceID = this.props.params.sensorId;
    //this.fetchData(deviceID);
    // console.log("device: " + deviceID);
    // console.log("this.state.servicePath: " + this.state.servicePath);
    // console.log("this.state.service: " + this.state.service);
    // console.log("this.state.historicalData: " + JSON.stringify(this.state.historicalData));
  }

  componentDidMount(){
    this.props.adminLogin(this.props.user);

  }

  componentWillMount() {
  }

  render() {
    if (this.state.markers.lenght > 0) {
    }
    const listMarkers = this.state.markers.map((marker, index) =>
      <Marker key={index} position={marker.position}>
        <Popup>
          <span>Sensor infos<br />{marker.position}</span>
        </Popup>
      </Marker>
    );

    return (
      <div className="sensor">
        <h1 className="page-title">Sensor: {this.state.id}</h1>
        <Container fluid={true}>
          <Card>
            <CardTitle title="Sensor Location" />
            <CardMedia>
              <Map ref="map" center={position} zoom={8}>
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {listMarkers}
              </Map>
            </CardMedia>
            <CardTitle title="Current Values" />
            <CardText>
              <List>
                {UTIL.getMeasurements(this.state.sensor).map((itemID) => {
                  return (
                    <ListItem primaryText={itemID.key + ": " + itemID.value} />
                  )
                })}
                <ListItem primaryText={"Date created: " + this.state.dateCreated} />
                <ListItem primaryText={"Date modified: " + this.state.dateModified} />
                <ListItem primaryText={"Service path: " + this.state.servicePath} />
              </List>
            </CardText>
            <CardTitle title="Historical Data" />
            <SensorChart sensor={this.state.sensor} service={this.state.service} servicePath={this.state.servicePath}/> 
          </Card>
        </Container>
      </div>
    );
  }
}

export default sensorDetail;
