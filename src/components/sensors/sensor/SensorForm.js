import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'


class SensorForm extends Component {

  constructor(props){
    super(props);
    const defaultSensor = new Waziup.Sensor("MySensor")
    defaultSensor.name = "My sensor"
    defaultSensor.domain = "waziup"
    defaultSensor.visibility = "public"
    this.state = {
      sensor: (this.props.sensor? this.props.sensor: defaultSensor)
    };
  }
  
  handleChange = (formData) => {
    var sensor = this.state.sensor
    sensor[formData.target.name] = formData.target.value;
    this.setState({sensor: sensor})
  }

  handleChangeVisibility = event => {
    var sensor = this.state.sensor
    console.log("vis:" + event.target.value)
    sensor.visibility = event.target.value;
    this.setState({sensor: sensor})
  };

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button color="primary" key="cancel" onTouchTap={()=>{handleClose();}}>Cancel</Button>,
      <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}>Submit</Button>
    ];

    return (
        <Dialog actions={actions} modal="true" open={modalOpen}>
          <DialogTitle>{this.props.isEdit? "Update Sensor Node": "Add Sensor Node"}</DialogTitle>
          <DialogContent>

          <Grid container spacing={24}>
        <Grid item xs={6}>
        <TextField 
          name="id" 
          disabled={this.props.isEdit} 
          label="Sensor ID" 
          value={this.state.sensor.id} 
          onChange={this.handleChange} 
          title="ID used by the gateway to send data"
          />
        </Grid>
        <Grid item xs={6}>
        <TextField
          id="standard-name"
          name="name"
          label="Sensor name"
          value={this.state.sensor.name}
          onChange={this.handleChange}
        />
        </Grid>
        <Grid item xs={6}>
        <TextField name="domain"  label="Domain" value={this.state.sensor.domain} onChange={this.handleChange} title="Domain this sensor belongs to"/>
        </Grid>
        <Grid item xs={6}>
        <FormControl>
          <InputLabel htmlFor="visibility">Visibility</InputLabel>
          <Select 
          input={<Input name="visibility" id="visibility" />}
          value={this.state.sensor.visibility} onChange={this.handleChangeVisibility} title="Public visibility of the sensor">
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
          </FormControl>
        </Grid>
      </Grid>
          </DialogContent>
          <DialogActions>
            {actions}
          </DialogActions>
        </Dialog>
      );
  }

  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  }
}

export default reduxForm({form: 'simple'})(SensorForm)
