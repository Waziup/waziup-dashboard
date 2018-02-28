import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField'
import { Row, Col} from 'react-grid-system'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'
import sensorImage from '../../../images/gauge.png';
import Divider from 'material-ui/Divider';

class MeasurementForm extends Component {

  constructor(props){
    super(props);
    var defaultMeas = new Waziup.Measurement("TC")
    defaultMeas.name = "My Temperature"
    defaultMeas.sensing_device = "Thermometer"
    defaultMeas.quantity_kind = "Temperature"
    defaultMeas.unit = "DegreeCelsius"
    this.state = {
      meas: (this.props.measurement? this.props.measurement: defaultMeas)
    };
  }
  
  handleChange = (formData) => {
    var meas = this.state.meas
    meas[formData.target.name] = formData.target.value;
    this.setState({meas: meas})
  }
  handleSelect = (field) => {
    return (event, index, value) => {
      var meas = this.state.meas
      meas[field] = value;
      this.setState({meas: meas});
    }
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{this.props.handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.meas); this.props.handleClose();}}/>,
    ];

    return (
      <Dialog title={this.props.isEdit? "Edit Measurement": "Add measurement"} actions={actions} modal={true} open={this.props.modalOpen} autoScrollBodyContent={true}>
         <img src={sensorImage} height="100"/>
         <div className="locationCoords">
           <TextField name="id" disabled={this.props.isEdit} floatingLabelText="ID" value={this.state.meas.id} onChange={this.handleChange} title="Short ID used by the Gateway to send the measure"/>
           <TextField name="name" floatingLabelText="Name" value={this.state.meas.name} onChange={this.handleChange} title="A name for this sensor measurement"/>
           <SelectField name="sensor_kind" floatingLabelText="Sensor"  value={this.state.meas.sensing_device} onChange={this.handleSelect("sensing_device")} title="The kind of sensor used for this measurement">
             {Waziup.SensingDevices.getAll().map(s => <MenuItem value={s.id} primaryText={s.label} />)}
           </SelectField>
           <SelectField name="dimension" floatingLabelText="Quantity kind"  value={this.state.meas.quantity_kind} onChange={this.handleSelect("quantity_kind")} title="What does it measures?">
             {Waziup.SensingDevices.getQKs(this.state.meas.sensing_device).map(qk => <MenuItem value={qk.id} primaryText={qk.label} />)}
           </SelectField>
           <SelectField name="unit" floatingLabelText="Unit"  value={this.state.meas.unit} onChange={this.handleSelect("unit")} title="The measurement unit">
             {Waziup.QuantityKinds.getUnits(this.state.meas.quantity_kind).map(u => <MenuItem value={u.id} primaryText={u.label} />)}
           </SelectField>
        </div>
      </Dialog>
    );
  }

  propTypes = {
    measurement: PropTypes.object, //Waziup.Measurement
    modalOpen: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}


export default reduxForm({
    form: 'simple'
})(MeasurementForm)
