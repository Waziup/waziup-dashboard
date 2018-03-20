import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import gatewayImage from '../../images/RPI.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import sensorNodeImage from '../../images/sensorNode.png';
import Line from './Line.js'
import ReactDOM from 'react-dom'
import GatewaySensor from './GatewaySensor.js'

export default class GatewayNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pos: []
    };
  }
  pos ={}
  getCoordinates = (ref) => {
    if(this.refs[ref]) {
      var dropMen = this.refs[ref].getDOMNode();
      var specs = dropMen.getBoundingClientRect();
      console.log("Coords:" + JSON.stringify(specs))
      return specs
    } else {
      return null
    }
  }

  render() {
    return ( 
      <Card className="sensorNode">
        <CardTitle>
          <h2 className="cardTitle"> Gateway {this.props.gateway.gatewayID} </h2>
        </CardTitle>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={gatewayImage} height="120"/>
          </div>
          <div className="sensorNodes">
            {this.props.gateway.sensors.map(s => <GatewaySensor sensor={s}/>) }
          </div>
        </div>
      </Card>
    );
  }

  propTypes = {
    gateway: PropTypes.object.isRequired
  }
}
