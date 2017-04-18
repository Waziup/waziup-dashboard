import axios from 'axios'
import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Container,  Col, Visible, Hidden } from 'react-grid-system'
import {List, ListItem} from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import rd3 from 'react-d3-library';
import SensorData from '../../SensorData.js'
import UTIL from '../../../utils.js'
const BarChart = rd3.BarChart;

var position = [12.238, -1.561];
class sensorDetail extends Component {
     constructor(props){
        super(props);
        this.state = {
            sensor: {},
            dateModified: "not available",
            dateCreated: "not available",
            servicePath: "not available",
            markers: [],
            id:this.props.params.sensorId,
            historicalData: []
        };
      }
 
  defaultProps = {
    sensors: []
  };

  componentWillReceiveProps(nextProps){
    if (nextProps.sensors && this.props.params.sensorId) {
        var sensor = nextProps.sensors.find((el)=>{
            return el.id === this.props.params.sensorId;
        });
        this.setState({sensor:sensor});
        
        if(sensor.dateModified && sensor.dateModified.value) {
           this.setState({dateModified:sensor.dateModified.value});
        }
        if(sensor.dateCreated && sensor.dateCreated.value) {
           this.setState({dateCreated:sensor.dateCreated.value});
        }
        if(sensor.servicePath && sensor.servicePath.value) {
           this.setState({servicePath:sensor.servicePath.value});
        }

        var markers = [];
        if(sensor.location && sensor.location.coordinates){
            markers.push({
              position:[
                sensor.location.coordinates[1],
                sensor.location.coordinates[0]
              ],
              defaultAnimation: 2,
            });
          }
        position = markers[0].position;
        this.setState({markers:markers})

    }

    console.log('in propos sensor: ' + JSON.stringify(this.state.sensor));

  }

 componentWillMount() {
      var url='http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/Device_6/attributes/temperature';
      console.log('sensor: ' + JSON.stringify(this.state.sensor));


      axios.get(url, {
        params: {'lastN': '10'},
        headers: {
        'Fiware-ServicePath':"/FL",
        'Fiware-Service':"waziup",
        "Accept": "application/json"
        }})
        .then((response)  => {
          console.log(response);
          var contextResponse0 = response.data.contextResponses[0];
          const {contextElement: contextElement} = contextResponse0;
          const attribute0 = contextElement.attributes[0];
          const values = attribute0.values;
          console.log("Temperature:" + attribute0.name);

          const data = {}
          data.dataSet = [];        
        
          for (var i in values) {
              var value = values[i];
              console.log(value.attrValue + "  ,  " + value.recvTime);
              data.dataSet.push({"label": value.recvTime.toString(), "value":value.attrValue});
          }
          console.log("inside" + JSON.stringify(data.dataSet));  
        
          
          data.margins = {top: 20, right: 20, bottom: 70, left: 40};
          data.yAxisLabel = 'Temperature (Celsious)';
          data.fill = [];
          data.width = 960;
          data.height = 700;
          data.ticks = 10;
          data.barClass = 'bar';
          this.setState({historicalData: [data]});        
      })
      .catch((response) => {
          console.log("ERROR");
          console.log(response);
          return;    
      })
  }
  
  render() {
    if (this.state.markers.lenght>0) {
    }
    const listMarkers = this.state.markers.map((marker,index) =>
            <Marker key={index} position={marker.position}>
              <Popup>
                <span>Sensor infos<br/>{marker.position}</span>
              </Popup>
            </Marker>
    ); 
    return (
      <div className="sensor">
        <h1 className="page-title">Sensor: {this.state.id}</h1>
        <Container fluid={true}>
           <Card>
            <CardTitle title="Sensor location"/>
            <CardMedia>
              <Map ref="map" center={position} zoom={8}>
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {listMarkers}
              </Map>
            </CardMedia>

            <CardTitle title="Current values"/>
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
            
            <CardTitle title="Historical Data"/>
            <CardText> {
                //console.log("data at use: " + JSON.stringify(this.state.historicalData[0].dataSet))
                }
                <BarChart data={this.state.historicalData[0]} />
            </CardText>
          </Card>
        </Container>
      </div>
    );
  }
}

export default sensorDetail;