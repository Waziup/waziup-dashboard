import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import gatewayImage from '../../images/RPI.png';
import loraImage from '../../images/lora.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import sensorNodeImage from '../../images/sensorNode.png';
import GatewaySensor from './GatewaySensor.js'
import LineTo from 'react-lineto';

export default class GatewayNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var gateway = this.props.gateway
    console.log("gateway:   " + JSON.stringify(gateway))
    return ( 
      <Card className="sensorNode">
        <CardTitle>
          <h2 className="cardTitle"> Gateway {gateway.gatewayID? gateway.gatewayID: "unknown"} </h2>
        </CardTitle>
        <div className="contentCards">
          <div className="boardIcon">
            <div className={"iconGateway gateway" + this.props.gateway.gatewayID + "-" + this.props.domainName}>
              <img src={gatewayImage} height="90"/>
            </div>
            <div className="icon">
              <img src={loraImage} height="30"/>
            </div>
          </div>
          <div className="gatewaySensorNodes">
            {this.props.gateway.sensors.map(s => <GatewaySensor sensor={s} updateSensorGatewayId={this.props.updateSensorGatewayId}/>) }
          </div>
          {this.props.gateway.sensors.map(s => 
            <LineTo from={"gateway" + this.props.gateway.gatewayID + "-" + this.props.domainName} to={"sensor" + s.id} className='gatewayLine'/>)
          }
        </div>
      </Card>
    );
  }

  propTypes = {
    gateway: PropTypes.object.isRequired,
    domainName: PropTypes.string.isRequired,
    updateSensorGatewayId: PropTypes.func.isRequired
  }
}
