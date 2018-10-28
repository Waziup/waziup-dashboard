import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import MeasurementForm from './MeasurementForm';
import MeasurementCard from './MeasurementCard';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import sensorImage from '../../../images/gauge.png';
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
      const card = <MeasurementCard measurement={m}
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
        <CardTitle>
          <h2 className="cardTitle"> {(sensor.name? sensor.name + " " : "") + "(" + sensor.id + ")"} </h2>
          {this.props.permission && this.props.permission.scopes.includes("sensors:delete")? 
            <RaisedButton label="Delete"
                          labelStyle={{height: '10px'}}
                          className="topRightButton"
                          primary={true}
                          onTouchTap={()=>{if(window.confirm('Delete sensor node?')) this.props.deleteSensor(sensor.id)}}/>: null}
          {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
            <RaisedButton label="Add measurement"
                          labelStyle={{height: '10px'}}
                          className="topRightButton"
                          primary={true}
                          onTouchTap={()=>{this.setState({modalAdd: true})}}/>: null}
          {this.props.permission && this.props.permission.scopes.includes("sensors:update")?
            <RaisedButton label="Edit"
                          labelStyle={{height: '10px'}}
                          className="topRightButton"
                          primary={true}
                          onTouchTap={()=>{this.setState({modalEdit: true})}}/>: null}
        </CardTitle>
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

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensor: PropTypes.func,
    deleteSensor: PropTypes.func,
    updateMeasurement: PropTypes.func,
    deleteMeasurement: PropTypes.func,
    permission: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }
}
