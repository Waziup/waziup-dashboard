import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import sensorImage from '../../images/gauge.png';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import * as Waziup from 'waziup-js'

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
    
    let activeStyle = (meas) => { 
      //Check if inactive delay expired
      if(new Date() > Date.parse(meas.timestamp) + config.delayInactiveMin) { 
        return {"background-color": "#ff4141", "box-shadow": "rgb(0, 0, 0) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px"} //Red
      } else {
        return {"background-color": "#32bf32", "box-shadow": "rgb(0, 0, 0) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px"} //Green
      }
    }

    return ( 
      <Card className="sensorNode">
        <CardTitle>
          <h2 className="sensorNodeTitle"> {sensor.name? sensor.name : "(" + sensor.id + ")"} </h2>
        </CardTitle>
        <div className="sensorNodeCards">
          <div className="boardIcon">
            <img src={sensorNodeImage} height="100" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
          </div>
          {sensor.measurements.map(meas => {return (
            <Card className="measCard" style={activeStyle(meas)}>
              <div className="cardTitleDiv">
                <pre className="cardTitle"> {meas.name? meas.name : "(" + meas.id + ")"} </pre>
              </div>
              <div className="cardContent">
                <div className="measIcon">
                  <img src={sensorImage} height="100" title={"Last timestamp: " + meas.timestamp}/>
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
