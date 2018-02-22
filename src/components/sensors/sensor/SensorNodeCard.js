import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import SensorBoardCard from './SensorBoardCard';
import MeasurementForm from './MeasurementForm';
import MeasurementCard from './MeasurementCard';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import sensorImage from '../../../images/gauge.png';

export default class SensorNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalMeas: false,
      modalAdd: false
    };
  }

  render() {

    let sensor = this.props.sensor;
    var measurements = [];
    for (let m of sensor.measurements) {
      measurements.push(<MeasurementCard measurement={m} isEditable={this.props.isEditable} updateMeasurement={this.props.updateMeasurement} 
                                         deleteMeasurement={this.props.deleteMeasurement} sensorId={sensor.id}/>);
    }

    return ( 
      <Card className="sensorNode">
        <MeasurementForm modalOpen={this.state.modalAdd} handleClose={()=>{this.setState({modalAdd: false})}}
                         onSubmit={(m) => {this.props.updateMeasurement(sensor.id, m); this.setState({modalAdd: false});}}
                         isEdit={false}/>
        <CardTitle>
          <h2 className="sensorNodeTitle"> Sensor Node </h2>
          {this.props.isEditable? <RaisedButton label="Delete" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.props.deleteSensor(sensor.id)}}/>: null}
          {this.props.isEditable? <RaisedButton label="Add measurement" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.setState({modalAdd: true})}}/>: null}
        </CardTitle>
        <div className="sensorNodeCards">
          <SensorBoardCard sensor={sensor} isEditable={this.props.isEditable} updateSensor={s => this.props.updateSensor(s)}/>
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
    isEditable: PropTypes.bool
  }
}
