import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import deviceNodeImage from '../../images/device.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import SensIcon from './device/sensor/SensIcon';
import newImage from '../../images/new.png';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default class DeviceLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let device = this.props.device;
    var sensors = [];
    if(device.sensors)
    for (let m of device.sensors) {
      const card =
        sensors.push(card);
    }

    let activeStyle = (sens) => { return (sens.last_value && new Date() < Date.parse(sens.last_value.date_received) + config.delayDeviceInactive) ? "cardGreen" : "cardRed" }
    let title = (sens) => { return sens.last_value ? "Date received: " + sens.last_value.date_received : "No data yet" }
    let deviceNodeNew = new Date() < Date.parse(device.date_created) + config.delayDeviceNodeNew
    let deviceName = (device.name ? device.name + " " : "") + "(" + device.id + ")";
    let maxlimit = 20;

    return (
      <Card className="deviceNode">
        <div>
          <Hidden mdUp implementation="css">
            <span className="Typography"> Node {((deviceName).length > maxlimit) ? (((deviceName).substring(0, maxlimit - 3)) + '...') : deviceName} </span>
          </Hidden>
          <Hidden smDown implementation="css">
            <span className="Typography"> Node {deviceName} </span>
          </Hidden>
        </div>

        <div className="contentCards">

          <Grid container direction="row" justify="flex-start" alignItems="center" spacing={24}>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="boardIcon">
                <img src={deviceNodeImage} height="64" title={device.dateUpdated ? "Last update at " + device.dateUpdated : "No data yet"} />
                {deviceNodeNew ? <img src={newImage} height="35" className="newIcon" /> : null}
                <pre> {device.owner ? "owner: " + device.owner + (this.props.user && device.owner == this.props.user.username ? " (you)" : "") : ""} </pre>
              </div>
            </Grid>

            {device.sensors ? device.sensors.map((sens, index) => {
              return (
                // <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card className={"card " + activeStyle(sens)} key={index}>
                    <div className="TypographyDiv">
                      <pre className="Typography"> {(sens.name ? sens.name : "") + "(" + sens.id + ")"} </pre>
                    </div>
                    <div className="cardContent">
                      <div className="sensIcon">
                        <SensIcon sensor_kind={sens.sensor_kind} height="64" title={title(sens)} />
                      </div>
                      <div className="sensValue">
                        <h3> {(sens.last_value ? JSON.stringify(sens.last_value.value).replace(/"/g, "") : "") + " " + (sens.unit ? Waziup.Units.getLabel(sens.unit) : "")} </h3>
                      </div>
                    </div>
                  </Card>
                // </Grid>
              )
            }):null}
          </Grid>
        </div>
      </Card>
    );
  }

  static propTypes = {
    device: PropTypes.object.isRequired, //Should be a Waziup.Device
    user: PropTypes.object.isRequired
  }
}
