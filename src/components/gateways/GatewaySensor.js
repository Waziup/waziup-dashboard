import React, { Component } from 'react';
import PropTypes from 'prop-types';
import sensorNodeImage from '../../images/sensorNode.png';
import config from '../../config';
import { Link } from 'react-router';
import EditIcon from '@material-ui/icons/Edit';
import GatewayForm from './GatewayForm.js';
import Hidden from '@material-ui/core/Hidden';

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
    let sensorName = (sensor.name ? sensor.name + " " : "") + "(" + sensor.id + ")";
    let maxlimit = 20;

    return ( 
      <div className="sensorNode">
        <GatewayForm sensor={sensor}
                     modalOpen={this.state.modalEdit}
                     handleClose={() => this.setState({ modalEdit: false })}
                     onSubmit={s => this.props.updateSensorGatewayId(sensor.id, s.gateway_id)} />
        {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
                  <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null}
        <Link to={'/sensors/' + sensor.id}> 
          <Hidden mdUp implementation="css">
            <h2 className="Typography"> Node {((sensorName).length > maxlimit) ? (((sensorName).substring(0, maxlimit - 3)) + '...') : sensorName} </h2>
          </Hidden>
          <Hidden smDown implementation="css">
            <h2 className="Typography"> Node {sensorName} </h2>
          </Hidden>
          <div className={"gatewayBoardIcon sensor" + sensor.id}>
            <img src={sensorNodeImage} height="64" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
          </div>
        </Link>
      </div>
    );
  }

  static propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensorGatewayId: PropTypes.func.isRequired,
    permission: PropTypes.object
  }
}
