import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import gatewayNodeImage from "../../images/gateway.png";
import deviceImage from "../../images/device.png";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import config from "../../config";
import LinkOnIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';

export default class GatewayLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let gateway = this.props.gateway;
    let gatewayName = gateway.name ? gateway.name + " " : "No name " + "(" + gateway.id + ")";
    let maxlimit = 30;
    let active = gateway && new Date() < Date.parse(gateway.date_modified) + config.delayDeviceActive ? true : false;
    return (
      <Card className="card" style={{width:'100%'}}>
        <pre className="Typography" style={{'vertical-align': "top"}}>
          {gatewayName}
        </pre>
        {gateway.connected ? 
          <Tooltip title="Your gateway is connected!">
            <LinkOnIcon style={{ fontSize: 32, fill: 'green', margin: '10px' }}/>
          </Tooltip>
        : <Tooltip title="Your gateway is not connected.">
            <LinkOffIcon style={{ fontSize: 32, fill: 'red', margin: '10px' }}/>
          </Tooltip>}

        <div className="contentCards">
          <Grid container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={24}>
            <Grid item xs={12}>
              <div className="boardIcon">
                <img src={gatewayNodeImage}
                     height="60"
                     title={gateway.date_modified ? "Last modified at " + gateway.date_modified : "No data yet"}/>
                <pre>
                  {" "}
                  {gateway.owner
                    ? "owner: " +
                      gateway.owner +
                      (this.props.user &&
                      gateway.owner == this.props.user.username
                        ? " (you)"
                        : "")
                    : ""}{" "}
                </pre>
                <pre>
                  {"ID: " + gateway.id}
                </pre>
              </div>
            </Grid>

            {gateway.devices
              ? gateway.devices.map((dev, index) => {
                  return (
                    <Card className="card" key={index}>
                      <div className="TypographyDiv">
                        <pre className="Typography"> {dev.name} </pre>
                      </div>
                      <div className="cardContent">
                        <div className="actuIcon">
                          <img src={deviceImage}
                               height="60" />
                        </div>
                      </div>
                    </Card>
                  );
                })
              : null}
          </Grid>
        </div>
      </Card>
    );
  }

  static propTypes = {
    gateway: PropTypes.object.isRequired, //Should be a Waziup.Gateway
    user: PropTypes.object.isRequired
  };
}
