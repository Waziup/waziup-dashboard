import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import PropTypes from "prop-types";
import gatewayNodeImage from "../../images/gateway.png";
import deviceImage from "../../images/device.png";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import config from "../../config";

export default class GatewayLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let gateway = this.props.gateway;
    let gatewayName =
      (gateway.name ? gateway.name + " " : "") + "(" + gateway.id + ")";
    let maxlimit = 30;
    let activeStyle =
      gateway &&
      new Date() < Date.parse(gateway.date_modified) + config.delayDeviceActive
        ? "cardGreen"
        : "cardRed";

    return (
      <Card className={"card " + activeStyle} style={{minWidth:'350px'}}>
        <pre className="Typography">
          {gatewayName && (
            <Tooltip title={gatewayName}>
              <span>
                {gatewayName.length > maxlimit
                  ? gatewayName.substring(0, maxlimit - 3) + "..."
                  : gatewayName}
              </span>
            </Tooltip>
          )}
        </pre>
        <div className="contentCards">
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={24}
          >
            <Grid item xs={12}>
              <div className="boardIcon">
                <img
                  src={gatewayNodeImage}
                  height="54"
                  title={
                    gateway.date_modified
                      ? "Last modified at " + gateway.date_modified
                      : "No data yet"
                  }
                />

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
                          <img src={deviceImage} height="64" />
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
