import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'

const position = [12.238, -1.561];

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
  }

  componentWillReceiveProps(nextProps){
  }
  
  choosePosition = (event) => {
    this.setState({position:[event.latlng.lat,event.latlng.lng]})
    this.props.change('sensorLon', event.latlng.lng);
    this.props.change('sensorLat', event.latlng.lat);
  }

  render() {
    const {reset, modalOpen, handleClose, onSubmit} = this.props;
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
                      ref="sensorLon" withRef/>
                    <Field
                      name="sensorLat"
                      component={TextField}
                      hintText="Latitude"
                      floatingLabelText="Latitude"
                      ref="sensorLat" withRef/>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Field name="sensorId"
                  component={TextField}
                  hintText="Sensor id"
                  floatingLabelText="Sensor Id"
                  ref="sensorId" withRef/>
              </Col>
              <Col md={4} offset={{md:2}}>
                <Field
                  name="sensorType"
                  component={SelectField}
                  hintText="Sensor Type"
                  floatingLabelText="Sensor Type">
                  <MenuItem value="SensingDevice" primaryText="Sensing Device"/>
                  <MenuItem value="Device" primaryText="Device"/>
                </Field>
              </Col>
              </Row>
              <Row>
                {/*<Col md={4}>
                  <Field name="sensorMeasurement"
                    component={TextField}
                    hintText="'Temperature'"
                    floatingLabelText="Measurement"
                    ref="sensorMeasurement" withRef/>
                </Col>
                <Col md={4} offset={{md:2}}>
                  <Field name="sensorUnit"
                    component={TextField}
                    hintText="Unit"
                    floatingLabelText="Sensor Unit"
                    ref="sensorUnit" withRef/>
                </Col> */}

            </Row>
            <Row>
              <Col>
            {/* <Field
                    name="sensorValueType"
                    component={SelectField}
                    hintText="Sensor Value type"
                    floatingLabelText="Sensor Value Type">
                    <MenuItem value="number" primaryText="Number"/>
                    <MenuItem value="percent" primaryText="Percent"/>
                  </Field>*/}
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
        // "sensorMeasurement": UTIL.getMeasurement(state.sensor.sensor)[0].key?UTIL.getMeasurement(state.sensor.sensor)[0].key:"",
    }
  })
)(sensorForm)
export default sensorForm;

