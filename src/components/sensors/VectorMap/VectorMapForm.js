import React, {Component} from 'react';
import { reduxForm, Field,FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer ,Circle ,FeatureGroup} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
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

class VectorMapForm extends Component {
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
 _onEditPath(e) {
   console.log('Path edited !');
 }
  _onCreate(e) {
    var polyline = e.layer;
    // To edit this polyline call : polyline.handler.enable()
   console.log(polyline);
 }
 _onDeleted(e) {
   console.log('Path deleted !');
 }

  _mounted(drawControl) {
    console.log('Component mounted !');
  }

  _onEditStart() {
    console.log('Edit is starting !');
  }

  _onEditStop() {
    console.log('Edit is stopping !');
  }

  _onDeleteStart() {
    console.log('Delete is starting !');
  }

  _onDeleteStop() {
    console.log('Delete is stopping !');
  }
  render() {
    const {pristine, reset, submitting, modalShowing, modalOpen, handleClose, onSubmit, formData} = this.props;
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
              title="Draw crop or pond"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'VectorMapDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
                <Col md={11}>
                   <Map  className="VectorMapForm" ref="map" center={position} zoom={5}>
                    <TileLayer
                      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                       <FeatureGroup>
                          <EditControl
                            position='topright'
                            onEdited={this._onEditPath}
                            onCreated={this._onCreate}
                            onDeleted={this._onDeleted}
                            draw={{  rectangle: false, circle:false, marker:false, polyline:false}}
                          />
                          <Circle center={[51.51, -0.06]} radius={200} />
                        </FeatureGroup>
                    </Map>
                </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Field name="VectorId"
                  component={TextField}
                  hintText="Vector Id"
                  floatingLabelText="Vector Id"
                  ref="sensorId" withRef/>
              </Col>
              </Row>
          </form>
        </Dialog>
      );
  }
}

// Decorate with redux-form
VectorMapForm = reduxForm({
  form: 'VectorMapForm',
})(VectorMapForm)

export default VectorMapForm;

