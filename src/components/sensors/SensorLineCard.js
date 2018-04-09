import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import sensorImage from '../../images/gauge.png';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import MeasIcon from './sensor/MeasIcon';

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
    
    let activeStyle = (meas) => {return (meas.timestamp && new Date() < Date.parse(meas.timestamp) + config.delaySensorInactive)? "cardGreen": "cardRed"}

    return ( 
      <Card className="sensorNode">
        <CardTitle className="sensorNodeTitle">
          <h3 className="cardTitle"> Node {sensor.name? sensor.name : "(" + sensor.id + ")"} </h3>
        </CardTitle>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={sensorNodeImage} height="64" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
          </div>
          {sensor.measurements.map(meas => {return (
            <Card className={"card " + activeStyle(meas)}>
              <div className="cardTitleDiv">
                <pre className="cardTitle"> {meas.name? meas.name : "(" + meas.id + ")"} </pre>
              </div>
              <div className="cardContent">
                <div className="measIcon">
                  <MeasIcon sensing_device={meas.sensing_device} height="64" title={"Last timestamp: " + meas.timestamp}/>
                </div>
                <div className="measValue"> 
                  <h3> {(meas.last_value? meas.last_value: "") + " " + (meas.unit? Waziup.Units.getLabel(meas.unit): "")} </h3>
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
  }
}
