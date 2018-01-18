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
      sensor: {},
      markers: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    this.findSensorSetMarkers(this.props);
    this.setState({ isLoading: false });
  }

  componentWillReceiveProps(nextProps) {
    this.findSensorSetMarkers(nextProps);
  }

  findSensorSetMarkers(props) {
    var sensor = props.sensors.find((el) => (el.id === props.params.sensorId));
    console.log("details:" + JSON.stringify(sensor))
    this.setState({ sensor: sensor });
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

    this.setState({ markers: markers })
  }

  render() {
    function fd(d) {
      return new moment(d).tz(moment.tz.guess()).format('H:mm a z MMMM Do YYYY')
      //return new moment(tick).tz(moment.tz.guess()).format('');MMMM Do YYYY H:mm a z
    }
    let renderElement = <h1> Sensor View is being loaded... </h1>;

    if (this.state.isLoading === false) {
      let sensorMap;
      if (this.state.markers.length > 0) {
        const listMarkers = this.state.markers.map((marker, index) =>
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

      const attributes = UTIL.getMeasurements(this.state.sensor).map(itemID => itemID.key);
      const dateCreated = this.state.sensor.dateCreated ? fd(this.state.sensor.dateCreated.value) : 'NA';
      const dateModified = this.state.sensor.dateModified ? fd(this.state.sensor.dateModified.value) : 'NA';
      const domain = this.state.sensor.domain ? this.state.sensor.domain : 'NA';

      const service = this.props.user.Service;
      //

      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">Sensor: {this.state.sensor.id}</h1>
          <Card>
            <CardTitle title="Historical Graph" />
            {/*<SensorChart attributes={attributes} sensorid={this.state.sensor.id} service={this.props.user.service} domain={domain} />*/}
            <CardTitle title="Sensor Details" />
            <CardText>
              <List>
                <h3> Last sensor reading was at {dateModified} with the following attributes:</h3>
                { 
                  this.state.sensor.measurements.map(meas => {
                    return ( <ListItem key={meas.id} primaryText={meas.name + ": " + meas.values[0].value + " " + meas.unit} /> )
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
