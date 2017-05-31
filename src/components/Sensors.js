import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FullWidthSection from './FullWidthSection'
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorForm from './sensors/sensorForm/sensorFormContainer.js'
import SensorOwner from './sensors/SensorOwner.js'
import SensorActions from './sensors/SensorActions.js'
import { Container} from 'react-grid-system'
import Griddle, {plugins, RowDefinition, ColumnDefinition, enhancedWithRowData} from 'griddle-react';
import Spinner from 'react-spinkit';
import Utils from '../utils';
import {loadSensors, createSensor, updateSensorLocation, updateSensorOwner, deleteSensor} from "../index.js"

class Sensors extends Component {

  constructor(props){
    super(props);
    this.state = {
      sensors:    [],
      formData:   {},
      update:     false,
      modalOpen:  false,
      isLoading:  false,
      loadAll:    false,
      isAllSensors: true,
    };

    loadSensors(true);
  }

  componentWillReceiveProps(nextProps){
    console.log("sensor props" + JSON.stringify(nextProps))

    if (nextProps.sensors) { // !== this.props.sensors) {
       this.setState({sensors:nextProps.sensors})
    }

    if (nextProps.isLoading) {
      this.setState({isLoading:nextProps.isLoading})
    }
  }

  componentDidMount(){
  }


  handleSensorDelete = (data) => {
      deleteSensor(data);
      loadSensors(this.state.isAllSensors);
  }

  handleSensorUpdate = (data) => {
      this.props.updateSensorStart(data);
      this.setState({update:true});
      this.setState({formData:data});
      this.setState({modalOpen: true});
  }

  handleOpen = () => {
    this.setState({update:false});
    this.setState({modalOpen: true});
  }

  handleClose = () => {
    this.setState({formData:{}});
    this.setState({modalOpen: false});
  }
  
  handleSubmitUpdate = (values) => {
    updateSensorLocation(values.sensorId, values.sensorLon, values.sensorLat);
    updateSensorOwner(values.sensorId);
    loadSensors(this.state.isAllSensors);
  }

  handleSubmit = (values) => {
    createSensor(values.sensorId, values.sensorType, values.sensorLon, values.sensorLat);
    loadSensors(this.state.isAllSensors);
  }


  handleChangeAllSensors = (event) => {
     loadSensors(event.target.checked);
     this.setState({isAllSensors: event.target.checked});
  }

  render() {
    
    const rowDataSelector = (state, { griddleKey }) => {
      console.log("sel: " + JSON.stringify(state))
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
        deleteAction: this.handleNotifDelete,
        updateAction: this.handleNotifUpdate
      };
    });
   
    return (
          <div>
            <h1 className="page-title">Sensors</h1>
            { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }

            <Container fluid={true}>
            <RaisedButton label="Add Sensors" primary={true} onTouchTap={()=>{ this.setState({formData:{}}); this.handleOpen();}} />
            <Checkbox label="All sensor" checked = {this.state.isAllSensors} onCheck = {(evt)=>{this.handleChangeAllSensors(evt)}} />
            <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={50} data={this.state.sensors} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()} >
                    <RowDefinition>
                       <ColumnDefinition id="id" title="ID"/>
                       <ColumnDefinition id="owner.value" title="Owner"/>
                       <ColumnDefinition id="values" title="Values" customComponent={enhancedWithRowData(SensorData)}/>
                       <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(SensorActions)}/> 
                    </RowDefinition>
                </Griddle>
            </FullWidthSection>
            <SensorForm ref={'sForm'} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={ this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
          </Container>
      </div>
    );
  }
}

export default Sensors;

