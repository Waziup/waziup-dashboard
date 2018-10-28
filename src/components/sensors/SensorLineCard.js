import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import sensorImage from '../../images/gauge.png';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import MeasIcon from './sensor/MeasIcon';
import newImage from '../../images/new.png';

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
    
    let activeStyle = (meas) => {return (meas.last_value && new Date() < Date.parse(meas.last_value.date_received) + config.delaySensorInactive)? "cardGreen": "cardRed"}
    let title = (meas) => {return meas.last_value ? "Date received: " + meas.last_value.date_received : "No data yet"}
    let sensorNodeNew = new Date() < Date.parse(sensor.date_created) + config.delaySensorNodeNew

    return ( 
      <Card className="sensorNode">
        <CardTitle className="sensorNodeTitle">
          <h3 className="cardTitle"> Node {(sensor.name? sensor.name + " " : "") + "(" + sensor.id + ")"} </h3>
        </CardTitle>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={sensorNodeImage} height="64" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
            {sensorNodeNew ? <img src={newImage} height="35" className="newIcon"/>: null}
            <pre> {sensor.owner? "owner: " + sensor.owner + (this.props.user && sensor.owner == this.props.user.username? " (you)": "") : ""} </pre>
            <pre> {"visibility: " + (sensor.visibility? sensor.visibility : "public")} </pre>
          </div>
          {sensor.measurements.map(meas => {return (
            <Card className={"card " + activeStyle(meas)}>
              <div className="cardTitleDiv">
                <pre className="cardTitle"> {(meas.name? meas.name : "") + "(" + meas.id + ")"} </pre>
              </div>
              <div className="cardContent">
                <div className="measIcon">
                  <MeasIcon sensing_device={meas.sensing_device} height="64" title={title(meas)}/>
                </div>
                <div className="measValue"> 
                  <h3> {(meas.last_value? JSON.stringify(meas.last_value.value).replace(/"/g, ""): "") + " " + (meas.unit? Waziup.Units.getLabel(meas.unit): "")} </h3>
                </div>
              </div>
            </Card>
          )})}
        </div>
      </Card>
    );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    user: PropTypes.object.isRequired
  }
}
