import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import gatewayImage from '../../images/RPI.png';
import loraImage from '../../images/lora.png';
import GatewaySensor from './GatewaySensor.js'

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
        <Typography>
          <span className="Typography"> Gateway {gateway.gatewayID? gateway.gatewayID: "unknown"} </span>
        </Typography>
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
            {this.props.gateway.sensors.map((s,index) => 
              <GatewaySensor sensor={s}
                             key={index}
                             updateSensorGatewayId={this.props.updateSensorGatewayId}
                             permission={this.props.permissions.find(p => p.resource == s.id)}/>) }
          </div>
        </div>
      </Card>
    );
  }

  static propTypes = {
    gateway: PropTypes.object.isRequired,
    domainName: PropTypes.string.isRequired,
    updateSensorGatewayId: PropTypes.func.isRequired,
    permissions: PropTypes.array
  }
}
