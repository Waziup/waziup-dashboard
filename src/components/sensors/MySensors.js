import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import SensorForm from './sensor/SensorForm.js';
import SensorsTable from './SensorsTable.js';
import MySensorsList from './MySensorsList.js';
import { createSensor, getSensors } from '../../actions/actions.js';
import sensorNodesImage from '../../images/sensorNodes.png';
import config from '../../config';

class MySensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddSensor: false,
      isCardsView: true,
    };
  }

  componentWillMount() {
    this.props.getSensors({ limit: 1000 });
    this.interval = setInterval(() => {
      this.props.getSensors({ limit: 1000 });
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container fluid>
        <h1 className="page-title">
          <img
            height="40"
            src={sensorNodesImage}
          />
          Sensor nodes
        </h1>
        <SensorForm
          handleClose={() => this.setState({ modalAddSensor: false })}
          modalOpen={this.state.modalAddSensor}
          onSubmit={s => this.props.createSensor(s)}
        />
        {this.state.isCardsView
          ? (
            <MySensorsList
              addSensor={() => {
                console.log('test'); this.setState({ modalAddSensor: true });
              }}
              sensors={this.props.sensors}
              user={this.props.user}
            />
          )
          : <SensorsTable sensors={this.props.sensors} />}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor: (sensor) => {
      dispatch(createSensor(sensor));
    },
    getSensors: (params) => {
      dispatch(getSensors(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MySensors);
