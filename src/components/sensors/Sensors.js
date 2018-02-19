import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorStatus from './SensorStatus.js'
import SensorForm from './SensorForm.js'
import SensorNodeCard from './sensor/SensorNodeCard.js'
import SensorActions from './SensorActions.js'
import SensorsTable from './SensorsTable.js'
import { Container } from 'react-grid-system'
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import Utils from '../../lib/utils';
import { getSensors, createSensor, updateSensorLocation, updateSensorOwner, deleteSensor } from "../../actions/actions.js"
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';


class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddSensor: false,
      isCardsView: true 
    };
  }
  
  componentDidMount() {
    this.props.getSensors();
  }

  handleSensorDelete = (sensor) => {
    this.props.deleteSensor(sensor.id);
  } 

  handleSubmitUpdate = (formData) => {
    console.log("sensor update:", formData);
    var loc = new Waziup.Location(formData.sensorLat, formData.sensorLon)
    this.props.updateSensorLocation(formData.sensorId, loc);
    this.props.updateSensorOwner(sensor.sensorId, this.props.user.preferred_username);
  }

  handleSubmit = (formData) => {
    var sensor = new Waziup.Sensor(formData.sensorId);
    sensor.location = {latitude: formData.sensorLat, longitude: formData.sensorLon}
    sensor.owner = this.props.user.preferred_username;
    this.props.createSensor(sensor);
  }

  render() {

    var sensorNodes = []
    for(var sensor of this.props.sensors) {
       const card = 
         <Link to={"/sensors/"+sensor.id} > 
           <SensorNodeCard className="sensorNode" sensor={sensor} updateSensorName={null} updateMeasurementName={null} 
                           deleteSensor={this.props.deleteSensor} addMeasurement={null}  />
         </Link>
       sensorNodes.push(card)
    }
    return (
      <Container fluid={true}>
        <h1 className="page-title">Sensor nodes</h1>
        <SensorForm ref={'sForm'} modalOpen={this.state.modalAddSensor} handleClose={() => this.setState({ modalAddSensor: false })} onSubmit={this.handleSubmit} />
        <pre className="tableSwitch" onClick={() => this.setState({isCardsView: !this.state.isCardsView})}> {this.state.isCardsView? "Switch to table view": "Switch to cards view"} </pre>
        {this.state.isCardsView? sensorNodes: <SensorsTable sensors={this.props.sensors} />}
        <RaisedButton label="Add sensor node" primary={true} onTouchTap={() => this.setState({ modalAddSensor: true })} />
      </Container>
    );
  }
}
//this.setState({isCardsView: !this.state.isCardsView})
function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    user: state.keycloak.idTokenParsed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSensorSuccess: (sensor) => { dispatch(updateSensorSuccess(sensor)) },
    createSensor: (sensor) => {dispatch(createSensor(sensor)) }, 
    getSensors: () => {dispatch(getSensors()) },
    deleteSensor: (sensorId) => {dispatch(deleteSensor(sensorId)) },
    updateSensorLocation: (sensorId, location) => {dispatch(updateSensorLocation(sensorId, location)) },
    updateSensorOwner: (sensorId, owner) => {dispatch(updateSensorOwner(sensorId, owner)) }
  };
}
const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
export default SensorsContainer;
