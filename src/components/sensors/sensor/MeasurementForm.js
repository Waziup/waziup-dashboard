import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'
import sensorImage from '../../../images/gauge.png';

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
    return event => {
      var meas = this.state.meas
      meas[field] = event.target.value;
      this.setState({meas: meas});
    }
  }

  render() {
    const actions = [
      <Button color="primary" key='cancel' onTouchTap={()=>{this.props.handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.meas); this.props.handleClose();}}>Submit</Button>,
    ];

    return (
      <Dialog actions={actions} modal={true} open={this.props.modalOpen} autoScrollBodyContent={true}>
         <DialogTitle>{this.props.isEdit? "Edit Measurement": "Add measurement"}</DialogTitle>
         <DialogContent>
         <img src={sensorImage} height="100"/>
         <div className="locationCoords">
         <Grid container spacing={24}>
        <Grid item xs={6}>
           <TextField name="id" disabled={this.props.isEdit} label="ID" value={this.state.meas.id} onChange={this.handleChange} title="Short ID used by the Gateway to send the measure"/>
           </Grid>
        <Grid item xs={6}>
           <TextField name="name" label="Name" value={this.state.meas.name} onChange={this.handleChange} title="A name for this sensor measurement"/>
           </Grid>
        <Grid item xs={6}>

          <FormControl>
            <InputLabel htmlFor="sensor_kind">Sensor</InputLabel>
            <Select 
            input={<Input name="sensor_kind" id="sensor_kind" />}
            value={this.state.meas.sensing_device} onChange={this.handleSelect("sensing_device")} title="The kind of sensor used for this measurement">
              {Waziup.SensingDevices.getAll().map(s => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
           </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel htmlFor="dimension">Quantity kind</InputLabel>
            <Select 
            input={<Input name="dimension" id="dimension" />}
            value={this.state.meas.quantity_kind} onChange={this.handleSelect("quantity_kind")} title="What does it measures?">
              {Waziup.SensingDevices.getQKs(this.state.meas.sensing_device).map(qk => <MenuItem key={qk.id} value={qk.id}>{qk.label}</MenuItem>)}
           </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl>
            <InputLabel htmlFor="unit">Unit</InputLabel>
            <Select 
            input={<Input name="unit" id="unit" />}
            value={this.state.meas.unit} onChange={this.handleSelect("unit")} title="The measurement unit">
              {Waziup.QuantityKinds.getUnits(this.state.meas.quantity_kind).map(u => <MenuItem key={u.id} value={u.id}>{u.label}</MenuItem>)}
           </Select>
          </FormControl>        
           </Grid>
           </Grid>
        </div>
        </DialogContent>
        <DialogActions>
            {actions}
        </DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
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
