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
    
    let activeStyle = (meas) => {return (meas.last_value && new Date() < Date.parse(meas.last_value.date_received) + config.delaySensorInactive)? "cardGreen": "cardRed"}
    let title = (meas) => {return meas.last_value ? "Date received: " + meas.last_value.date_received : "No data yet"}

    return ( 
      <div className="sensorNode">
        <GatewayForm sensor={sensor}
                     modalOpen={this.state.modalEdit}
                     handleClose={() => this.setState({ modalEdit: false })}
                     onSubmit={s => this.props.updateSensorGatewayId(sensor.id, s.gateway_id)} />
        {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
                  <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null}
        <Link to={'/sensors/' + sensor.id}> 
          <h2 className="cardTitle"> Node {(sensor.name? sensor.name + " ": "" ) + "(" + sensor.id + ")"} </h2>
          <div className={"gatewayBoardIcon sensor" + sensor.id}>
            <img src={sensorNodeImage} height="64" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
          </div>
        </Link>
      </div>
    );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensorGatewayId: PropTypes.func.isRequired,
    permission: PropTypes.object.isRequired
  }
}
