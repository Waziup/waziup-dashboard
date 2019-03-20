import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import MeasIcon from './sensor/MeasIcon';
import newImage from '../../images/new.png';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default class SensorLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let sensor = this.props.sensor;
    var measurements = [];
    for (let m of sensor.measurements) {
      const card =
        measurements.push(card);
    }

    let activeStyle = (meas) => { return (meas.last_value && new Date() < Date.parse(meas.last_value.date_received) + config.delaySensorInactive) ? "cardGreen" : "cardRed" }
    let title = (meas) => { return meas.last_value ? "Date received: " + meas.last_value.date_received : "No data yet" }
    let sensorNodeNew = new Date() < Date.parse(sensor.date_created) + config.delaySensorNodeNew
    let sensorName = (sensor.name ? sensor.name + " " : "") + "(" + sensor.id + ")";
    let maxlimit = 20;

    return (
      <Card className="sensorNode">
        <div>
          <Hidden mdUp implementation="css">
            <span className="Typography"> Node {((sensorName).length > maxlimit) ? (((sensorName).substring(0, maxlimit - 3)) + '...') : sensorName} </span>
          </Hidden>
          <Hidden smDown implementation="css">
            <span className="Typography"> Node {sensorName} </span>
          </Hidden>
        </div>

        <div className="contentCards">

          <Grid container direction="row" justify="flex-start" alignItems="center" spacing={24}>

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="boardIcon">
                <img src={sensorNodeImage} height="64" title={sensor.dateUpdated ? "Last update at " + sensor.dateUpdated : "No data yet"} />
                {sensorNodeNew ? <img src={newImage} height="35" className="newIcon" /> : null}
                <pre> {sensor.owner ? "owner: " + sensor.owner + (this.props.user && sensor.owner == this.props.user.username ? " (you)" : "") : ""} </pre>
                <pre> {"visibility: " + (sensor.visibility ? sensor.visibility : "public")} </pre>
              </div>
            </Grid>

            {sensor.measurements.map((meas, index) => {
              return (
                // <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card className={"card " + activeStyle(meas)} key={index}>
                    <div className="TypographyDiv">
                      <pre className="Typography"> {(meas.name ? meas.name : "") + "(" + meas.id + ")"} </pre>
                    </div>
                    <div className="cardContent">
                      <div className="measIcon">
                        <MeasIcon sensing_device={meas.sensing_device} height="64" title={title(meas)} />
                      </div>
                      <div className="measValue">
                        <h3> {(meas.last_value ? JSON.stringify(meas.last_value.value).replace(/"/g, "") : "") + " " + (meas.unit ? Waziup.Units.getLabel(meas.unit) : "")} </h3>
                      </div>
                    </div>
                  </Card>
                // </Grid>
              )
            })}
          </Grid>
        </div>
      </Card>
    );
  }

  static propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    user: PropTypes.object.isRequired
  }
}
