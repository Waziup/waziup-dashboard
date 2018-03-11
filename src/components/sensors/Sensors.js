import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import SensorForm from './sensor/SensorForm.js'
import SensorNodeCard from './sensor/SensorNodeCard.js'
import SensorsTable from './SensorsTable.js'
import { Container } from 'react-grid-system'
import Utils from '../../lib/utils';
import { getSensors, createSensor, updateSensorLocation, updateSensorOwner, deleteSensor } from "../../actions/actions.js"
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import sensorNodesImage from '../../images/sensorNodes.png';


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

  render() {
    var sensorNodes = []
    for(var sensor of this.props.sensors) {
       const card = 
         <Link to={"/sensors/"+sensor.id} > 
           <SensorNodeCard className="sensorNode" sensor={sensor} isEditable={false}/>
         </Link>
       sensorNodes.push(card)
    }
    return (
      <Container fluid={true}>
        <h1 className="page-title">
          <img src={sensorNodesImage} height="40"/>
          Sensor nodes
        </h1>
        <SensorForm modalOpen={this.state.modalAddSensor}
                    handleClose={() => this.setState({ modalAddSensor: false })}
                    onSubmit={s => this.props.createSensor(s)}/>
        <pre className="tableSwitch" onClick={() => this.setState({isCardsView: !this.state.isCardsView})}> {this.state.isCardsView? "Switch to table view": "Switch to cards view"} </pre>
        {this.state.isCardsView? 
          sensorNodes : 
          <SensorsTable sensors={this.props.sensors} />}
        <RaisedButton label="Add sensor node" primary={true} onTouchTap={() => this.setState({ modalAddSensor: true })} />
      </Container>
    );
  }
}

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
