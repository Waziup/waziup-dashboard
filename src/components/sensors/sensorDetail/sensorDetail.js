import axios from 'axios'
import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container, Col, Visible, Hidden } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import UTIL from '../../../utils.js'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

var position = [12.238, -1.561];
class sensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensor: {},
      dateModified: "not available",
      dateCreated: "not available",
      servicePath: "not available",
      service: "watersense",
      markers: [],
      id: this.props.params.sensorId,
      historicalData: {},
    };
  }

  defaultProps = {
    sensors: []
  };

  componentWillReceiveProps(nextProps) {
      
    console.log("Sensors=" + JSON.stringify(nextProps.sensors));
    if (nextProps.sensors && this.props.params.sensorId) {
      console.log("Sensors=" + JSON.stringify(nextProps.sensors));
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
      if(this.props.params.sensorId)
        var deviceID = this.props.params.sensorId;
    
      //  var measurementIds = UTIL.getMeasurements(sensor).map((item) => {
      //    console.log(item.key);
      //     this.getData(deviceID, item.key);
      //     return (item.key);
      //   })
      this.fetchData(deviceID);
      console.log("DeviceID: " + JSON.stringify(deviceID));
      console.log("Sensor" + JSON.stringify(this.state.sensor));
      // for(var measurementId in UTIL.getMeasurements(this.state.sensor)) {
      //   console.log("json measurement" + JSON.stringify(measurementId));
      //   this.getData(deviceID, measurementId.key);
      // }
      //console.log("measurementIds: " + JSON.stringify(measurementIds));

      console.log("this.state.historicalData: " + JSON.stringify(this.state.historicalData));
  }
  
  componentDidMount(){
  }

  componentWillMount() {

    //console.log("willMount lifecycle this.state.historicalData: " + JSON.stringify(this.state.historicalData));
  }

  fetchData(deviceID) {
    Promise.all(UTIL.getMeasurements(this.state.sensor).map((item) => {
      //console.log("ikey" + item.key);
      var measurementId = item.key;

      var url = 'http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/' + deviceID + '/attributes/' + measurementId;
      axios.get(url, {
        params: { 'lastN': '10' },
        headers: {
          'Fiware-ServicePath': this.state.servicePath,
          'Fiware-Service': this.state.service,
          "Accept": "application/json"
        }
      })
        .then((response) => {
          const contextResponse0 = response.data.contextResponses[0];
          const { contextElement: contextElement } = contextResponse0;
          const attribute0 = contextElement.attributes[0];
          const values = attribute0.values;
          const data = [];
          for (var i in values) {
            const value = values[i];
            //console.log(value.attrValue + "  ,  " + value.recvTime);
            data.push({ time: value.recvTime.toString().substring(11, 19), value: parseFloat(value.attrValue) });
          }

          if (data.length > 0) {
            this.setState({
              historicalData: {
                ...this.state.historicalData,
                [measurementId]: data
              }
            });
          }
        }).catch((response) => {
          console.log("ERROR");
          console.log(response);
          return;
        })
      }))
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

    var visCompAll = [];
    //this.state.historicalData[measurementId]
    //Object.keys(this.state.historicalData).forEach (([measurementId], data) => { });
    //<!-- ReferenceLine x="Page C" stroke="red" label="Max PV PAGE"/ -->
    for (var measurementId in this.state.historicalData) {
      
      //const data = this.state.historicalData[measurementId];
      const unit = this.state.sensor[measurementId]["metadata"]["unit"]["value"];
      //const unit = 'cm';
      const YAxisLabel = measurementId + '(' + unit + ')';
      var visComp = [<CardText> Historical data is not available for {YAxisLabel}. </CardText>]
      if (this.state.historicalData[measurementId].length > 0) {
        //console.log("There are some data for " + measurementId + " " + JSON.stringify(this.state.historicalData[measurementId]));
        var title = 'Historical data graph for ' + measurementId;
        visComp = [<CardTitle title={title} /> ]
        var visComp2 = [
          <CardText>
          <LineChart width={900} height={800} data={this.state.historicalData[measurementId]} margin={{ top: 40, right: 40, bottom: 25, left: 50 }}>
            <Line type="monotone" fill="#8884d8" dataKey="value" stroke="#8884d8" dot={{ stroke: 'red', strokeWidth: 5 }} activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }} name={measurementId} />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="time" padding={{ left: 30, right: 20 }} label="Time" name="Date" />
            <YAxis dataKey="value" padding={{ left: 20, right: 20, bottom: 40}} label={YAxisLabel} name={measurementId} />
            <Tooltip />
            (measurementId === 'SM1')? <ReferenceLine y={300} label="the most wet condition" padding={{ left: 10, right: 10 }} stroke="blue"/>
              <ReferenceLine y={1000} label="the driest condition" padding={{ left: 10, right: 10 }} stroke="red"/>
              : ;
          </LineChart>
        </CardText>]
        visComp = visComp.concat(visComp2);
      }
      visCompAll = visCompAll.concat(visComp);
    }
    //visCompAll += '</div>';
    console.log('visCompAll:' + visCompAll);
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
            {visCompAll}
          </Card>
        </Container>
      </div>
    );
  }
}

export default sensorDetail;
