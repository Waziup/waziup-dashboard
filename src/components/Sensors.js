import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FullWidthSection from './FullWidthSection'
import { connect } from 'react-redux';
import SensorData from './SensorData.js'
import SensorForm from './sensors/sensorForm/sensorFormContainer.js'
import SensorOwner from './sensors/SensorOwner.js'
import RowActions from './sensors/RowActions.js'
import { Container} from 'react-grid-system'
import Griddle from 'griddle-react';
import Spinner from 'react-spinkit';
import UTIL from '../utils';
import {loadSensors, createSensor, deleteSensor} from "../index.js"

class Sensors extends Component {

  constructor(props){
    super(props);
    this.state = {
      data:       props.data,
      formData:   {},
      update:     false,
      modalOpen:  false,
      isLoading:  false,
      loadAll:    false,
      isAllSensors: true,
    };

    loadSensors(true);
  }

  defaultProps = {
    data: []
  };
  
  componentWillReceiveProps(nextProps){
 
    if (nextProps.sensors) {
       this.setState({sensors:nextProps.sensors})
    }

    if (nextProps.isLoading) {
      this.setState({isLoading:nextProps.isLoading})
    }
  }

  componentDidMount(){
  }


  handleSensorDelete = (data)=>{deleteSensor(data)}

  handleSensorUpdate = (data)=>{
      this.props.updateSensorStart(data);
      this.setState({update:true});
      this.setState({formData:data});
      this.setState({modalOpen: true});
  }

  handleOpen = () => {
    this.setState({update:false});
    this.setState({modalOpen: true});
  };

  handleClose = () => {
    this.setState({formData:{}});
    this.setState({modalOpen: false});
  };

  tableMeta = [
    {
      "columnName": "id",
      "order": 1,
      "displayName": "ID"
    },
    {
      "columnName": "type",
      "order": 2,
      "visible": true,
      "displayName": "Sensor type"
    },
    {
      "columnName": "owner",
      "order": 3,
      "visible": true,
      "displayName": "Owner",
      "customComponent": SensorOwner
    },
    {
      "columnName": "last_value",
      "order": 4,
      "visible": true,
      "displayName": "Last Values",
      "customComponent": SensorData
    },
    {
      "columnName": "actions",
      "order": 5,
      "visible": true,
      "displayName": "Actions",
      "customComponent": RowActions,
	  'customComponentMetadata': {
		'deleteAction': this.handleSensorDelete,
		'updateAction': this.handleSensorUpdate
		}
    },

  ];
  handleSubmitUpdate = (values) => {
      if (values.sensorLon) {
        let sensor  = {
          id: values.sensorId,
          update:{
              location: {
                  value: {
                    type: "Point",
                    coordinates: [values.sensorLon,values.sensorLat]
                  },
                  type: "geo:json"
            },
            owner: {
             type: "string",
             value: this.props.currentUser.username,
            },
          }
        }

        var mySensor = this.state.data.find((s) => {
            return s.id === sensor.id;
        });
        this.props.updateSensorLocation(sensor, this.props.currentUser.attributes.Service[0], mySensor.servicePath.value);
      }
  }

  handleSubmit(values) {
     createSensor(values.sensorId, values.sensorType, values.sensorLon, values.sensorLat);
  }


  handleChangeAllSensors = (event) => {
     loadSensors(event.target.checked);
     this.setState({isAllSensors: event.target.checked});
  }

  render() {
    let {data} = this.props;

    return (
          <div>
            <h1 className="page-title">Sensors</h1>
          { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }

          <Container fluid={true}>
            <RaisedButton label="Add Sensors" primary={true} onTouchTap={()=>{
                this.setState({formData:{}});
                this.handleOpen();
            }} />
              <Checkbox
                  label="All sensor"
                  checked = {this.state.isAllSensors}
                  onCheck = {(evt)=>{this.handleChangeAllSensors(evt)}}
              />
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={50} results={this.state.sensors} columnMetadata={this.tableMeta} columns={["id", "type","owner","last_value",'actions']} showFilter={true} />
              </FullWidthSection>
                <SensorForm   ref={'sForm'} modalOpen={this.state.modalOpen}
                 handleClose={this.handleClose} onSubmit={ this.state.update ? this.handleSubmitUpdate : this.handleSubmit} />
            </Container>
      </div>
    );
  }
}


export default Sensors;

