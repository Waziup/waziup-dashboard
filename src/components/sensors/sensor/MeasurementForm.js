import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'
import sensorImage from '../../../images/gauge.png';

class MeasurementForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      meas: {}
    };
  }
  
  handleChange = (formData) => {
    var meas = this.state.meas
    meas[formData.target.name] = formData.target.value;
    this.setState({meas: meas})
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{this.props.handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.meas); this.props.handleClose();}}/>,
    ];
    return (
      <Dialog title="New measurement" actions={actions} modal={true} open={this.props.modalOpen} autoScrollBodyContent={true}>
         <img src={sensorImage} height="100"/>
         <div className="locationCoords">
           <TextField name="id"          floatingLabelText="ID"           value={this.state.meas.id}          onChange={this.handleChange}/>
           <TextField name="name"        floatingLabelText="Name"         value={this.state.meas.name}        onChange={this.handleChange}/>
           <TextField name="dimension"   floatingLabelText="Dimension"    value={this.state.meas.dimension}   onChange={this.handleChange}/>
           <TextField name="unit"        floatingLabelText="Unit"         value={this.state.meas.unit}        onChange={this.handleChange}/>
           <TextField name="sensor_kind" floatingLabelText="Sensor kind"  value={this.state.meas.sensor_kind} onChange={this.handleChange}/>
        </div>
      </Dialog>
    );
  }

  propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
}


export default reduxForm({
    form: 'simple'
})(MeasurementForm)
