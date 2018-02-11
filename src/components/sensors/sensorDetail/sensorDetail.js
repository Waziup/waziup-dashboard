import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart/SensorChartContainer';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';

var position;

class sensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensor: null,
      isLoading: true,
    };
  }

  componentDidMount() {
    this.props.getSensors();
    var sensor = this.props.sensors.find((el) => (el.id === this.props.params.sensorId));
    this.setState({sensor: sensor});
    this.setState({ isLoading: false });
  }

  componentWillReceiveProps(nextProps) {
    var sensor = this.props.sensors.find((el) => (el.id === this.props.params.sensorId));
    this.setState({sensor: sensor});
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
    console.log("sens:" + JSON.stringify(this.state.sensor))
    if (this.state.sensor) {
      let markers = this.getMarkers(this.state.sensor);
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
          sensorMap = <g><CardTitle title="Sensor Location" />
            <CardMedia>
              <Map ref="map" center={position} zoom={8}>
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

      const dateCreated = this.state.sensor.dateCreated ? this.formatDate(this.state.sensor.dateCreated.value) : 'NA';
      const dateModified = this.state.sensor.dateModified ? this.formatDate(this.state.sensor.dateModified.value) : 'NA';
      const domain = this.state.sensor.domain ? this.state.sensor.domain : 'NA';

      const service = this.props.user.Service;

      let historyGraph = null
      if (this.state.sensor.measurements && this.state.sensor.measurements[0] && this.state.sensor.measurements[0].values && this.state.sensor.measurements[0].values[0]) {
        historyGraph = <SensorChart measurements={this.state.sensor.measurements} sensorid={this.state.sensor.id} service={this.props.user.service} domain={domain} />
      } else {
        historyGraph = <CardText> <h3> No history.</h3> </CardText>
      }
      

      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor: {this.state.sensor.id}</h1>
          <Card>
            <CardTitle title="Historical Graph" />
            { historyGraph }
            <CardTitle title="Sensor Details" />
            <CardText>
              <List>
                <h3> Last sensor reading was at {dateModified} with the following attributes:</h3>
                { 
                  this.state.sensor.measurements.map(meas => {
                    return ( <ListItem key={meas.id} primaryText={(meas.name? meas.name: meas.id) + ": " + (meas.values && meas.values[0] ? meas.values[0].value : "no value") + " " + (meas.unit? meas.unit : "")} /> )
                  })
                }
                <br />
                <ListItem primaryText={"Creation Date: " + dateCreated} />
                <ListItem primaryText={"Domain: " + domain} />
              </List>
            </CardText>
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

export default sensorDetail;
