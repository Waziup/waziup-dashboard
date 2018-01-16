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
import { createSensor, updateSensorLocation, updateSensorOwner, deleteSensor } from "../../api-adapter.js"

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      formData: {},
      update: false,
      modalOpen: false,
      isLoading: false,
      loadAll: false,
      isAllSensors: true
    };
  }

  findSetSensors(props) {
    const sensors = props.sensors.filter(el => (el.type === 'SensingDevice'));

    if (!!sensors)
      this.setState({ sensors: sensors });
    else
      this.setState({ sensors: [] });

    this.setState({ isLoading: props.isLoading })
  }

  componentDidMount() {
    this.findSetSensors(this.props)
    console.log('Sensors:' + JSON.stringify(this.props.sensors));
  }

  /*componentWillReceiveProps(newProps) {
    this.findSetSensors(newProps)
  }*/

  handleSensorDelete = (sensor) => {
    console.log("delete:" + JSON.stringify(sensor));
    this.props.deleteSensor(sensor.id, sensor.servicePath.value, this.props.user);
    this.props.loadSensors(this.state.isAllSensors, this.props.user);
  }

  handleSensorUpdate = (data) => {
    this.props.updateSensorSuccess(data);
    this.setState({ update: true });
    this.setState({ formData: data });
    this.setState({ modalOpen: true });
  }

  handleOpen = () => {
    this.setState({ update: false });
    this.setState({ modalOpen: true });
  }

  handleClose = () => {
    this.setState({ formData: {} });
    this.setState({ modalOpen: false });
  }

  handleSubmitUpdate = (sensor) => {
    console.log("update:", sensor);
    this.props.updateSensorLocation(sensor, this.props.user);
    this.props.updateSensorOwner(sensor.sensorId, sensor.servicePath, this.props.user);
    this.props.loadSensors(this.state.isAllSensors, this.props.user);
  }

  //console.log("idTokenParsed", JSON.stringify(this.props.user));
  handleSubmit = (sensor) => {
    //console.log("handle submit", JSON.stringify(sensor));

    this.props.createSensor(sensor, this.props.user);
    this.props.loadSensors(this.state.isAllSensors, this.props.user);
  }

  handleChangeAllSensors = (event) => {
    console.log("change");
    this.props.loadSensors(event.target.checked, this.props.user);
    this.setState({ isAllSensors: event.target.checked });
  }

  render() {
    console.log('Sensors in render:' + JSON.stringify(this.props.sensors));
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
    //FIXME: checkbox should be set according to initial state as well
    return (
      <Container fluid={true}>
        <h1 className="page-title">Sensors</h1>
        <RaisedButton label="Add Sensors" primary={true} onTouchTap={() => { this.setState({ formData: {} }); this.handleOpen(); }} />
        <Checkbox label="All Sensors" onCheck={(evt) => { this.handleChangeAllSensors(evt) }} />
        <SensorForm ref={'sForm'} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
        {this.props.isLoading === true ?
          <div> Sensors are being loaded ... </div> :
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
