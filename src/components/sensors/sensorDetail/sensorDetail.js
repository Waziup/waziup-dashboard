import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer, Polygon } from 'react-leaflet';
import SensorChart from './SensorChart/SensorChartContainer';
import UTIL from '../../../utils.js';
import { loadSensors } from "../../../index.js"
import moment from 'moment-timezone';

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
      fields: [],
      id: this.props.params.sensorId,
      historicalData: {},
    };

    loadSensors(true);
  }

  defaultProps = {
    sensors: []
  };

  componentWillReceiveProps(nextProps) {
      //console.log("nextProps");
    if(this.props.user.preferred_username === 'watersense'){
      this.setState({service: "watersense"});
    } else {
      this.setState({service: "waziup"});
    }

    if (nextProps.currentUser !== this.props.currentUser){
      this.props.fetchSensors(this.state.service, this.state.servicePath);
    }

      //console.log("nextProps.sensors:" + JSON.stringify(nextProps.sensors));
      //console.log("this.props.params.sensorId:" + JSON.stringify(this.props.params.sensorId));
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
      var fields = [];
      if (sensor.location && sensor.location.value.coordinates && sensor.type === 'SensingDevice' ) {
             markers.push({
              position: [
                sensor.location.value.coordinates[1],
                sensor.location.value.coordinates[0]
              ],
              defaultAnimation: 2,
            });

           position = markers[0].position;
      }else if(sensor.type==='Field' && sensor.location ){
              var f = UTIL.convertLonLatToLatLon(sensor.location.value.coordinates); 
          console.log(f);
              fields.push(f);

           position = fields[0][0][0];
      }

        this.setState({ markers: markers })
        this.setState({fields:fields})

    }
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  render() {
    const listMarkers = this.state.markers.map((marker, index) =>
      <Marker key={index} position={marker.position}>
        <Popup>
          <span>Sensor infos<br />{marker.position}</span>
        </Popup>
      </Marker>
    );
    const listFields = this.state.fields.map((field,index) =>
        <Polygon key={index} color="purple" positions={field} /> 
    )
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
                {listFields}
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
                <ListItem primaryText={"Creation Date: " + moment(this.state.dateCreated).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z')} />
                <ListItem primaryText={"Last Updates: " + moment(this.state.dateModified).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z')} />
                <ListItem primaryText={"Service Path: " + this.state.servicePath} />
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
