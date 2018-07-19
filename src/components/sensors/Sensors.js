import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import SensorForm from './sensor/SensorForm.js'
import SensorsTable from './SensorsTable.js'
import SensorsList from './SensorsList.js'
import { Container } from 'react-grid-system'
import Utils from '../../lib/utils';
import { getSensors, createSensor, updateSensorLocation, updateSensorOwner, deleteSensor } from "../../actions/actions.js"
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import sensorNodesImage from '../../images/sensorNodes.png';
import config from '../../config';

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddSensor: false,
      isCardsView: true 
    };
  }
  
  componentWillMount() {
    this.props.getSensors({lastN: 1000});
    this.interval = setInterval(() => {this.props.getSensors({lastN: 1000})}, config.delayRefresh);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container fluid={true}>
        <h1 className="page-title">
          <img src={sensorNodesImage} height="40"/>
          Sensor nodes
        </h1>
        <SensorForm modalOpen={this.state.modalAddSensor}
                    handleClose={() => this.setState({ modalAddSensor: false })}
                    onSubmit={s => this.props.createSensor(s)}
                    user={this.props.user}/>
        <pre className="tableSwitch" onClick={() => this.setState({isCardsView: !this.state.isCardsView})}> {this.state.isCardsView? "Switch to table view": "Switch to cards view"} </pre>
        {this.state.isCardsView? 
          <SensorsList  sensors={this.props.sensors} user={this.props.user} addSensor={() => {console.log("test"); this.setState({modalAddSensor: true})}}/>: 
          <SensorsTable sensors={this.props.sensors}/>}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    user: state.current_user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor: (sensor) => {dispatch(createSensor(sensor)) }, 
    getSensors: (params) => {dispatch(getSensors(params)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sensors);
