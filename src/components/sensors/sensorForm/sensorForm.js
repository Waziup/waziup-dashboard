import React, {Component} from 'react';
import { reduxForm, Field,FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import UTIL from '../../../utils.js';
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import IconButton from 'material-ui/IconButton';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui'
import {  Row, Col, Visible} from 'react-grid-system'
import { initialize } from 'redux-form'
// validation functions
const required = value => value == null ? 'Required' : undefined

const position = [12.238, -1.561];


const renderField = props => (
  <div>
    <label>{props.placeholder}</label>
    <div>
      <input {...props}/>
      {props.touched && props.error && <span>{props.error}</span>}
    </div>
  </div>
)


const renderMeasurement = ({ fields }) => (
  <ul>
    <li>
      <RaisedButton onClick={() => fields.push({})}>Add Measurement</RaisedButton>
    </li>
    {fields.map((measurement, index) =>
      <li key={index}>
          <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={()=>{fields.remove(index)}}>
			<Delete  color={red500}/>
		   </IconButton>
        <h4>Measurement #{index + 1}</h4>
        <Field
          name={`${measurement}.measure`}
          type="text"
          component={renderField}
          placeholder="Measurement"/>
        <Field
          name={`${measurement}.type`}
          type="text"
          component={renderField}
          placeholder="Type"/>
      </li>
    )}
  </ul>
)

class sensorForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      position : [12.238000,-1.561111],
      sensor:{
      }
    };
  }
  componentDidMount() {
    if(!UTIL.objIsEmpty(this.props.formData)){
            this.setState({sensor:{
                "sensorLon": this.props.formData.location? this.props.formData.location.value.coordinates[0]:position[0],
                "sensorLat": this.props.formData.location? this.props.formData.location.value.coordinates[1]:position[1],
                "sensorId": this.props.formData.id,
                "sensorType" :  this.props.formData.type,
                "sensorMeasurement": UTIL.getMeasurment(this.props.formData)[0]?UTIL.getMeasurment(this.props.formData)[0]:"",
            }})
     }
  }
  componentWillReceiveProps(nextProps){
     if(!UTIL.objIsEmpty(nextProps.formData)){
         // this.props.updateSensorStart(nextProps.formData);
    }

  }
  choosePosition = (event) => {
    this.setState({position:[event.latlng.lat,event.latlng.lng]})
    this.props.change('sensorLon', event.latlng.lng);
    this.props.change('sensorLat', event.latlng.lat);
  }

  render() {
    const {pristine, reset, submitting,modalShowing, modalOpen,handleClose, onSubmit,formData} = this.props;
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            this.setState({sensor:{}});
            reset();
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          this.props.submit();
          handleClose();
        }}
      />,
    ];

    return (
        <Dialog
              title="Add new Sensor"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'sensorFormDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
                <Col md={8}>
                   <Map  className="sensorform" ref="map" center={position} zoom={5}>
                    <TileLayer
                      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker onDrag={(e)=>{this.choosePosition(e)}} position={this.state.position} draggable={true}>
                      <Popup>
                        <span>Your sensor position !</span>
                      </Popup>
                    </Marker>
                    </Map>
                </Col>
                <Col md={4}>
                    <div>Sensor Location:</div>
                    <Field name="sensorLon"
                      component={TextField}
                      hintText="Longitude"
                      floatingLabelText="Longitude"
                      validate={required}
                      ref="sensorLon" withRef/>
                    <Field
                      name="sensorLat"
                      component={TextField}
                      hintText="Latitude"
                      floatingLabelText="Latitude"
                      validate={required}
                      ref="sensorLat" withRef/>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Field name="sensorId"
                  component={TextField}
                  hintText="Sensor id"
                  floatingLabelText="Sensor Id"
                  validate={required}
                  ref="sensorId" withRef/>
              </Col>
              <Col md={4} offset={{md:2}}>
                <Field
                  name="sensorType"
                  component={SelectField}
                  hintText="Sensor Type"
                  floatingLabelText="Sensor Type"
                  validate={required}>
                  <MenuItem value="SensingDevice" primaryText="Sensing Device"/>
                  <MenuItem value="Device" primaryText="Device"/>
                </Field>
              </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Field name="sensorMeasurement"
                    component={TextField}
                    hintText="'Temperature'"
                    floatingLabelText="Measurement"
                    validate={required}
                    ref="sensorMeasurement" withRef/>
                </Col>
                <Col md={4} offset={{md:2}}>
                  <Field name="sensorUnit"
                    component={TextField}
                    hintText="Unit"
                    floatingLabelText="Sensor Unit"
                    validate={required}
                    ref="sensorUnit" withRef/>
                </Col>
              <FieldArray name="measurement" component={renderMeasurement}/>
            </Row>
            <Row>
              <Col>
                <Field
                    name="sensorValueType"
                    component={SelectField}
                    hintText="Sensor Value type"
                    floatingLabelText="Sensor Value Type"
                    validate={required}>
                    <MenuItem value="number" primaryText="Number"/>
                    <MenuItem value="percent" primaryText="Percent"/>
                  </Field>
              </Col>
            </Row>
          </form>
        </Dialog>
      );
  }
}
// Decorate with redux-form
sensorForm = reduxForm({
  form: 'sensorForm',
  enableReinitialize : true, // this is needed!!
})(sensorForm)
sensorForm = connect(
  state => ({
    initialValues:{
        "sensorLon": state.sensor.sensor.location? state.sensor.sensor.location.value.coordinates[0]:position[0],
        "sensorLat": state.sensor.sensor.location? state.sensor.sensor.location.value.coordinates[1]:position[1],
        "sensorId": state.sensor.sensor.id,
        "sensorType" :  state.sensor.sensor.type,
        "sensorMeasurement": UTIL.getMeasurment(state.sensor.sensor)[0]?UTIL.getMeasurment(state.sensor.sensor)[0]:"",
    }
  })
)(sensorForm)
export default sensorForm;

