import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import gatewayImage from '../../images/gateway.png';
import loraImage from '../../images/lora.png';
import GatewayDevice from './GatewayDevice.js'
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default class GatewayNetwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    var gateway = this.props.gateway
    console.log("gateway:   " + JSON.stringify(gateway));
    let gatewayID = gateway.gatewayID? gateway.gatewayID: "unknown";
    let maxlimit = 20;
    
    return ( 
      <Card className="deviceNode">
        <Typography>
        <Hidden mdUp implementation="css">
            <span className="Typography"> Gateway {((gatewayID).length > maxlimit) ? (((gatewayID).substring(0, maxlimit - 3)) + '...') : gatewayID} </span>
          </Hidden>
          <Hidden smDown implementation="css">
            <span className="Typography"> Gateway {gatewayID} </span>
          </Hidden>
        </Typography> 
        <div className="contentCards">
        <Grid container direction="row" justify="flex-start" alignItems="center" spacing={24}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="boardIcon">
            <div className={"iconGateway gateway" + this.props.gateway.gatewayID + "-" + this.props.domainName}>
              <img src={gatewayImage} height="90"/>
            </div>
            <div className="icon">
              <img src={loraImage} height="30"/>
            </div>
          </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className="gatewayDeviceNodes">
            {this.props.gateway.devices.map((s,index) => 
                  
              <GatewayDevice device={s}
                             key={index}
                             updateDeviceGatewayId={this.props.updateDeviceGatewayId}
                             permission={this.props.permissions.find(p => p.resource == s.id)}/>
                             ) }
          </div>
          </Grid>
          </Grid>
          </div>        
      </Card>
    );
  }

  static propTypes = {
    gateway: PropTypes.object.isRequired,
    domainName: PropTypes.string.isRequired,
    updateDeviceGatewayId: PropTypes.func.isRequired,
    permissions: PropTypes.array
  }
}
