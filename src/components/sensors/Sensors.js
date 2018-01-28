import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorStatus from './SensorStatus.js'
import SensorForm from './sensorForm/sensorFormContainer.js'
import SensorActions from './SensorActions.js'
import { Container } from 'react-grid-system'
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import Utils from '../../lib/utils';
import { createSensor, updateSensorLocation, updateSensorOwner, deleteSensor } from "../../actions/actions.js"
import * as Waziup from 'waziup_api'


class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false,
      modalOpen: false,
      loadAll: false
    };
  }

  componentDidMount() {
    this.props.getSensors();
  }

  handleSensorDelete = (sensor) => {
    console.info("delete:" + JSON.stringify(sensor));
    this.props.deleteSensor(sensor.id);
    this.props.getSensors();
  } 

  handleSensorUpdate = (data) => {
    this.setState({ update: true });
    this.setState({ modalOpen: true });
  }

  handleOpen = () => {
    this.setState({ update: false });
    this.setState({ modalOpen: true });
  }

  handleClose = () => {
    this.setState({ modalOpen: false });
    this.props.getSensors();
  }

  handleSubmitUpdate = (formData) => {
    console.log("sensor update:", formData);
    var loc = new Waziup.Location(formData.sensorLat, formData.sensorLon)
    this.props.updateSensorLocation(formData.sensorId, loc);
    this.props.updateSensorOwner(sensor.sensorId, this.props.user.preferred_username);
    this.props.getSensors();
  }

  handleSubmit = (formData) => {
    var sensor = new Waziup.Sensor(formData.sensorId);
    sensor.location = {latitude: formData.sensorLat, longitude: formData.sensorLon}
    sensor.owner = this.props.user.preferred_username;
    this.props.createSensor(sensor);
    this.props.getSensors();
  }

  render() {
    const rowDataSelector = (state, { griddleKey }) => {
      return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .delete('griddleKey')
        .toJSON();
    };

    const enhancedWithRowData = connect((state, props) => {
      return {
        // rowData will be available into RowActions
        rowData: rowDataSelector(state, props),
        deleteAction: this.handleSensorDelete,
        updateAction: this.handleSensorUpdate,
        vectorAction: this.handleVectorSave
      };
    });
    return (
      <Container fluid={true}>
        <h1 className="page-title">Sensors</h1>
        <RaisedButton label="Add Sensors" primary={true} onTouchTap={() => { this.handleOpen(); }} />
        <SensorForm ref={'sForm'} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
        {//this.props.isLoading === true ?
         // <div> Sensors are being loaded ... </div> :
          <Griddle resultsPerPage={10} data={this.props.sensors} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()} >
            <RowDefinition>
              <ColumnDefinition id="id" title="ID" />
              <ColumnDefinition id="owner" title="Owner" />
              <ColumnDefinition id="values" title="Values" customComponent={enhancedWithRowData(SensorData)} />
              <ColumnDefinition id="status" title="Status" customComponent={enhancedWithRowData(SensorStatus)} />
              <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(SensorActions)} />
            </RowDefinition>
          </Griddle>
        }
      </Container>
    );
  }
}

export default Sensors;
