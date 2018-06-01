import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { SelectField, TextField } from 'redux-form-material-ui'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'

class GatewayForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      sensor: this.props.sensor
    };
  }
  
  handleChange = (formData) => {
    var sensor = this.state.sensor
    sensor[formData.target.name] = formData.target.value;
    this.setState({sensor: sensor})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}/>,
    ];

    return (
        <Dialog title="Update Gateway ID" actions={actions} modal={true} open={modalOpen}>
          <TextField disabled={true} name="id" floatingLabelText="Sensor ID" value={this.state.sensor.id} onChange={this.handleChange} title="ID used by the gateway to send data"/>
          <TextField name="gateway_id"  floatingLabelText="Gateway ID" value={this.state.sensor.gateway_id} onChange={this.handleChange} title="ID of the gateway attached to the sensor"/>
        </Dialog>
      );
  }

  propTypes = {
    sensor: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
}

export default reduxForm({form: 'simple'})(GatewayForm)
