import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import MeasurementForm from './MeasurementForm';
import MeasurementCard from './MeasurementCard';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import sensorImage from '../../../images/gauge.png';
import sensorNodeImage from '../../../images/sensorNode.png';
import SensorForm from '../SensorForm.js'

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
                                    isEditable={this.props.isDetails}
                                    isDetailsLink={this.props.isDetails}
                                    updateMeasurement={this.props.updateMeasurement} 
                                    deleteMeasurement={this.props.deleteMeasurement}
                                    sensorId={sensor.id}/>
      measurements.push(card);
    }

    return ( 
      <Card className="sensorNode">
        <MeasurementForm modalOpen={this.state.modalAdd}
                         handleClose={()=>{this.setState({modalAdd: false})}}
                         onSubmit={(m) => {this.props.updateMeasurement(sensor.id, m);
                         this.setState({modalAdd: false});}}
                         isEdit={false}/>
        <SensorForm sensor={sensor}
                    isEdit={this.props.isDetails}
                    modalOpen={this.state.modalEdit}
                    handleClose={() => this.setState({ modalEdit: false })}
                    onSubmit={s => this.props.updateSensorName(sensor.id, s.name)} />
        <CardTitle>
          <h2 className="sensorNodeTitle"> {sensor.name} </h2>
          {this.props.isDetails? <RaisedButton label="Delete" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.props.deleteSensor(sensor.id)}}/>: null}
          {this.props.isDetails? <RaisedButton label="Add measurement" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.setState({modalAdd: true})}}/>: null}
          {this.props.isDetails? <RaisedButton label="Edit" labelStyle={{height: '10px'}} className="changeLocationButton" primary={true} onTouchTap={()=>{this.setState({modalEdit: true})}}/>: null}
        </CardTitle>
        <div className="sensorNodeCards">
          <div className="boardIcon">
            <img src={sensorNodeImage} height="100" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
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
    isDetails: PropTypes.bool
  }
}
