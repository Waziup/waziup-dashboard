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


class DeviceForm extends Component {

  constructor(props){
    super(props);
    const defaultDevice = new Waziup.Device("MyDevice")
    defaultDevice.id = "MyDevice"
    defaultDevice.name = "My device"
    defaultDevice.domain = "waziup"
    defaultDevice.visibility = "public"
    defaultDevice.sensors = []
    defaultDevice.actuators = []
    defaultDevice.gateway_id = ""
    this.state = {
      scanName: "",
      device: (this.props.device? this.props.device: defaultDevice),
      gateways: []
    };
  }

  getGateways() {
    let gateways = this.props.gateways;
    this.setState({ gateways: gateways });
  }

  componentWillMount() {
    this.getGateways();
  }

  componentDidMount(){
    this.getDeviceName();
  }

  getDeviceName() {
    this.setState({ scanName: this.props.deviceName });
  }

  componentWillReceiveProps(){
    if(this.props.isEdit)
    this.setState({device:this.props.device})
  }
  
  componentWillReceiveProps(nextProps) { 
    if(nextProps.device && nextProps.device !== this.state.device) {
      this.setState({device: nextProps.device})
    }
  }
  
  handleChange = (formData) => {
    var device = this.state.device
    device[formData.target.name] = formData.target.value;
    this.setState({device: device})
  }

  handleGatewayChange = event => {
    var device = this.state.device;
    device.gateway_id = event.target.value;
    this.setState({ device });
  };

  handleChangeVisibility = event => {
    var device = this.state.device
    device.visibility = event.target.value;
    this.setState({device: device})
  };

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button color="primary" key="cancel" onTouchTap={()=>{handleClose();}}>Cancel</Button>,
      <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.device); handleClose();}}>Submit</Button>
    ];

    return (
        <Dialog actions={actions} modal="true" open={modalOpen}>
          <DialogTitle>{this.props.isEdit? "Update A Device": "Add A Device"}</DialogTitle>
          <DialogContent>

          <Grid container spacing={24}>
        <Grid item xs={6}>
          {/* the scanName from the state contains the result of the qr code scan */}
        {console.log("=====",this.state.scanName)}
        <TextField 
          name="id" 
          disabled={this.props.isEdit} 
          label="Device ID" 
          value={this.state.device.id} 
          onChange={this.handleChange} 
          title="ID used by the gateway to send data"
          fullWidth
          />
        </Grid>
        <Grid item xs={6}>
        <TextField
          id="standard-name"
          name="name"
          label="Device name"
          value={this.state.device.name}
          onChange={this.handleChange}
          fullWidth
        />
        </Grid>
        <Grid item xs={6}>
        <TextField name="domain"  label="Domain" fullWidth value={this.state.device.domain} onChange={this.handleChange} title="Domain this device belongs to"/>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor="gateway_id">Gateway</InputLabel>
          <Select
            input={<Input name="gateway_id" id="gateway_id" />}
            value={this.state.device.gateway_id}
            onChange={this.handleGatewayChange}
          >
            {this.state.gateways.map(s => (
              <MenuItem
                key={s.id}
                checked={this.state.device.gateway_id == s.id}
                value={s.id}
              >
                {s.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel htmlFor="visibility">Visibility</InputLabel>
          <Select
          input={<Input name="visibility" id="visibility" />}
          value={this.state.device.visibility} onChange={this.handleChangeVisibility} title="Public visibility of the device">
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
    device: PropTypes.object, //Should be a Waziup.Device
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  }
}

export default reduxForm({form: 'simple'})(DeviceForm)
