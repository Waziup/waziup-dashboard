import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import sensorImage from '../../images/gauge.png';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import GatewayForm from './GatewayForm.js'
import MeasIcon from '../sensors/sensor/MeasIcon';

export default class SensorLineCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
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
      <div className="sensorNode">
        <GatewayForm sensor={sensor}
                     modalOpen={this.state.modalEdit}
                     handleClose={() => this.setState({ modalEdit: false })}
                     onSubmit={s => this.props.updateSensorGatewayId(sensor.id, s.gateway_id)} />
        <CardTitle>
          <h2 className="cardTitle"> Node {sensor.name? sensor.name : "(" + sensor.id + ")"} </h2>
          <EditIcon onClick={() => this.setState({modalEdit: true})}/>
        </CardTitle>
        <Link to={'/sensors/' + sensor.id}> 
          <div className="contentCards">
            <div className={"boardIcon sensor" + sensor.id}>
              <img src={sensorNodeImage} height="64" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
            </div>
            {sensor.measurements.map(meas => {return (
              <Card className={"card " + activeStyle(meas)}>
                <div className="cardTitleDiv">
                  <pre className="cardTitle"> {meas.name? meas.name : "(" + meas.id + ")"} </pre>
                </div>
                <div className="cardContent">
                  <div className="measIcon">
                    <MeasIcon sensing_device={meas.sensing_device} height="100" title={"Last timestamp: " + meas.timestamp}/>
                  </div>
                  <div className="measValue"> 
                    <h3> {(meas.last_value? meas.last_value: "") + " " + (meas.unit? Waziup.Units.getLabel(meas.unit): "")} </h3>
                  </div>
                </div>
              </Card>
            )})}
          </div>
        </Link>
      </div>
    );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensorGatewayId: PropTypes.func.isRequired
  }
}
