import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Container,  Col, Visible, Hidden } from 'react-grid-system'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';





var position = [12.238, -1.561];
class sensorDetail extends Component {
     constructor(props){
        super(props);
        this.state = {
            sensor:{},
            markers: [],
            id:this.props.params.sensorId,
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
        var markers = [];
        if(sensor.location && sensor.location.value && sensor.location.value.coordinates){
            markers.push({
              position:[
                sensor.location.value.coordinates[1],
                sensor.location.value.coordinates[0]
              ],
              defaultAnimation: 2,
            });
          }
        position = markers[0].position;
        this.setState({markers:markers})
    }
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
        <h1 className="page-title">Sensors / {this.state.id}</h1>
        <Container fluid={true}>
           <Card>
            <CardHeader
              title={this.state.id+" Map location"}
            />
            <CardMedia
            >
              <Map ref="map" center={position} zoom={8}>
                <TileLayer
                  url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {listMarkers}
              </Map>

            </CardMedia>
            <CardTitle title="Sensor details"/>
            <CardText>
                
            </CardText>
            <CardActions>
            </CardActions>
          </Card>
        </Container>
      </div>
    );
  }
}

export default sensorDetail;
