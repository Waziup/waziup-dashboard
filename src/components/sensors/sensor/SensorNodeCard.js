import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import MeasurementForm from './MeasurementForm';
import MeasurementCard from './MeasurementCard';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import sensorNodeImage from '../../../images/sensorNode.png';
import SensorForm from './SensorForm.js'

export default class SensorNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMeas: false,
      modalAdd: false,
      modalEdit: false
    };
  }

  render() {
    let sensor = this.props.sensor;
    var measurements = [];
    for (let m of sensor.measurements) {
      const card = <MeasurementCard key={m.id}
                                    measurement={m}
                                    isDetails={false}
                                    updateMeasurement={this.props.updateMeasurement} 
                                    deleteMeasurement={this.props.deleteMeasurement}
                                    sensorId={sensor.id}
                                    permission={this.props.permission}/>
      measurements.push(card);
    }
    console.log("perms:" + JSON.stringify(this.props.permission))
    return ( 
      <Card className="sensorNode">
        <MeasurementForm modalOpen={this.state.modalAdd}
                         handleClose={()=>{this.setState({modalAdd: false})}}
                         onSubmit={(m) => {this.props.updateMeasurement(sensor.id, m);
                         this.setState({modalAdd: false});}}
                         isEdit={false}/>
        <SensorForm sensor={sensor}
                    isEdit={true}
                    modalOpen={this.state.modalEdit}
                    handleClose={() => this.setState({ modalEdit: false })}
                    onSubmit={s => this.props.updateSensorName(sensor.id, s.name)} />
        <Typography>
          <span className="Typography"> {(sensor.name? sensor.name + " " : "") + "(" + sensor.id + ")"} </span>
          {this.props.permission && this.props.permission.scopes.includes("sensors:delete")? 
            <Button 
                          className="topRightButton"
                          variant="contained" 
                          color="primary"
                          onTouchTap={()=>{if(window.confirm('Delete sensor node?')) this.props.deleteSensor(sensor.id)}}>Delete</Button>: null}
          {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
            <Button
                          className="topRightButton"
                          variant="contained" 
                          color="primary"
                          onTouchTap={()=>{this.setState({modalAdd: true})}}>Add measurement</Button>: null}
          {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
            <Button
                          className="topRightButton"
                          variant="contained" 
                          color="primary"
                          onTouchTap={()=>{this.setState({modalEdit: true})}}>Edit</Button>: null}
        </Typography>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={sensorNodeImage} height="75" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
            <pre> {sensor.owner? "owner: " + sensor.owner + (this.props.user && sensor.owner == this.props.user.username? " (you)": "") : ""} </pre>
            <pre> {"visibility: " + (sensor.visibility? sensor.visibility : "public")} </pre>
            <pre> {"domain: " + (sensor.domain? sensor.domain : "none")} </pre>
          </div>
          {measurements}
        </div>
      </Card>
    );
  }

  static propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensor: PropTypes.func,
    deleteSensor: PropTypes.func,
    updateMeasurement: PropTypes.func,
    deleteMeasurement: PropTypes.func,
    permission: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }
}
