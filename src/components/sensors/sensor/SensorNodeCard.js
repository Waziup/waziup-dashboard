import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SensorCard from './SensorCard';
import MeasurementForm from './MeasurementForm';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import sensorNodeImage from '../../../images/sensorNode.png';
import sensorImage from '../../../images/gauge.png';

export default class SensorNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    let sensor = this.props.sensor;
    var measurements = [];
    for (let m of sensor.measurements) {
      let changeMeasName = this.props.updateMeasurementName? n => this.props.updateMeasurementName(sensor.id, m.id, n): null;
      measurements.push(<SensorCard name={m.name} changeName={changeMeasName} value={m.last_value + " " + (m.unit? m.unit: null)} image={sensorImage} lastUpdate={m.timestamp}/>);
    }
    let changeSensorName = this.props.updateSensorName? n => this.props.updateSensorName(sensor.id, n): null;

    return ( 
      <Card className="sensorNode">
        <CardTitle>
          <h2 className="sensorNodeTitle"> Sensor Node - {sensor.id} </h2>
          {this.props.deleteSensor? <RaisedButton label="Delete" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.props.deleteSensor(sensor.id)}}/>: null}
          {this.props.addMeasurement? <RaisedButton label="Add measurement" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.setState({modalMeas: true})}}/>: null}
          {this.props.addMeasurement? <MeasurementForm modalOpen={this.state.modalMeas} handleClose={()=>{this.setState({modalMeas: false})}} onSubmit={m => this.props.addMeasurement(sensor.id, m)}/>: null}
        </CardTitle>
        <div className="sensorNodeCards">
          <SensorCard name={sensor.name} changeName={changeSensorName} image={sensorNodeImage} lastUpdate={sensor.dateUpdated}/>
          {measurements}
        </div>
      </Card>
    );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateSensorName: PropTypes.func,
    updateMeasurementName: PropTypes.func,
    deleteSensor: PropTypes.func,
    addMeasurement: PropTypes.func,
  }
}
