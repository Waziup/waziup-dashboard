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
import deviceImage from '../../../images/gauge.png';

class ActuatorForm extends Component {

  constructor(props){
    super(props);
    var defaultActu = new Waziup.Actuator("TC")
    defaultActu.name = "My Temperature"
    defaultActu.actuator_kind = "Thermometer"
    defaultActu.actuator_value_type = "Temperature"
    defaultActu.value = "DegreeCelsius"
    this.state = {
      actu: (this.props.actuator? this.props.actuator: defaultActu)
    };
  }
  
  handleChange = (formData) => {
    var actu = this.state.actu
    actu[formData.target.name] = formData.target.value;
    this.setState({actu: actu})
  }

  handleSelect = (field) => {
    return event => {
      var actu = this.state.actu
      actu[field] = event.target.value;
      this.setState({actu: actu});
    }
  }

  render() {
    const actions = [
      <Button color="primary" key='cancel' onTouchTap={()=>{this.props.handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.actu); this.props.handleClose();}}>Submit</Button>,
    ];

    return (
      <Dialog actions={actions} modal={true} open={this.props.modalOpen} autoScrollBodyContent={true}>
         <DialogTitle>{this.props.isEdit? "Edit Actuator": "Add actuator"}</DialogTitle>
         <DialogContent>
         <img src={deviceImage} height="100"/>
         <div className="locationCoords">
         <Grid container spacing={24}>
        <Grid item xs={6}>
           <TextField name="id" disabled={this.props.isEdit} label="ID" value={this.state.actu.id} onChange={this.handleChange} title="Short ID used by the Gateway to send the actuure"/>
           </Grid>
        <Grid item xs={6}>
           <TextField name="name" label="Name" value={this.state.actu.name} onChange={this.handleChange} title="A name for this device actuator"/>
           </Grid>
        <Grid item xs={6}>

          <FormControl>
            <InputLabel htmlFor="device_kind">Device</InputLabel>
            <Select 
            input={<Input name="device_kind" id="device_kind" />}
            value={this.state.actu.actuator_kind} onChange={this.handleSelect("actuator_kind")} title="The kind of device used for this actuator">
              {Waziup.ActuatorKinds.getAll().map(s => <MenuItem key={s.id} value={s.id}>{s.label}</MenuItem>)}
            </Select>
          </FormControl>
           </Grid>
        <Grid item xs={6}>
          <FormControl>
            <InputLabel htmlFor="dimension">Actuator kind</InputLabel>
            <Select 
            input={<Input name="dimension" id="dimension" />}
            value={this.state.actu.quantity_kind} onChange={this.handleSelect("quantity_kind")} title="What does it actuures?">
              {Waziup.ActuatorKinds.getVTs(this.state.actu.actuator_kind).map(qk => <MenuItem key={qk.id} value={qk.id}>{qk.label}</MenuItem>)}
           </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl>
            <InputLabel htmlFor="unit">Value Type</InputLabel>
            <Select 
            input={<Input name="unit" id="unit" />}
            value={this.state.actu.unit} onChange={this.handleSelect("unit")} title="The actuator unit">
              {Waziup.QuantityKinds.getUnits(this.state.actu.quantity_kind).map(u => <MenuItem key={u.id} value={u.id}>{u.label}</MenuItem>)}
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
    actuator: PropTypes.object, //Waziup.Actuator
    modalOpen: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}


export default reduxForm({
    form: 'simple'
})(ActuatorForm)
