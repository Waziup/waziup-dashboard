import React, { Component } from 'react'
import { Map, Marker, Popup, TileLayer, CircleMarker, Circle } from 'react-leaflet';
import { Container } from 'react-grid-system'
//, Row, Col, Visible, Hidden, ScreenClassRender 

class Home extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         markers: [],
    //         position: [12.238, -1.561]
    //     };
    // }

    render() {
        /*const listMarkers = this.state.markers.map((marker,index) =>
                <Marker key={index} position={marker.position}>
                  <Popup>
                    <span>{marker.name}</span>
                  </Popup>
                </Marker>
        );    */
        
        //London const position = [51.505, -0.09];
        //Latitude and longitude coordinates are: 31.582045, 74.329376.
        const position = [31.582045, 74.329376];
/*
                    <Marker position={position}>
                        <Popup>
                            <span>A pretty CSS3 popup.</span>
                        </Popup>
                    </Marker>*/
        return (
            <Container fluid={true}>
                    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css" />
                <Map center={position} zoom={5}>
                    <TileLayer
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    <Circle center={position} fillColor="blue" radius={1000} />
                    <CircleMarker center={position} color="red" radius={20}>
                        <Popup>
                            <span>Popup in CircleMarker</span>
                        </Popup>
                    </CircleMarker>

                </Map>
            </Container>
        );
    }
}

export default Home