import React, {Component} from 'react';
import { reduxForm } from 'redux-form'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import deviceImage from '../../images/gauge.png';
import deviceArrow from '../../images/deviceArrow.png';
import bellImage from '../../images/bell-icon.png';
import PersonAdd from '@material-ui/icons/PersonAdd';
import Socials from '@material-ui/icons/Share';
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

class NotifForm extends Component {
  constructor(props) {
    super(props);
    console.log("notif before:" + JSON.stringify(props.notif))
    const defaultNotif = Waziup.Notification.constructFromObject({
      condition: { devices: [], sensors: [], expression: "SM1>40"},
      action: {channels: [], message: "Waziup: Field is too dry. ${id} humidity value is ${SM1}", usernames: []},
      description: "Waziup notification",
      throttling: 1,
      expires: ""})
    this.state = {
      notif: props.notif? props.notif: defaultNotif,
      devices: [],
      expDate:""
    };
    console.log("users:" + JSON.stringify(props.users))    
  }

  compare(a,b) {
    if (a.id < b.id)
      return -1;
    if (a.id > b.id)
      return 1;
    return 0;
  }

  componentWillMount() {
    let devices =  this.props.devices.sort(this.compare);
    this.setState({devices:devices })
    console.log(devices);
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var notif = this.state.notif
    switch (field) {
      case "devices"      : notif.condition.devices = value; break;
      case "sensors" : notif.condition.sensors = value; break;
      case "expr"         : notif.condition.expression = value; break;
      case "channels"     : notif.action.channels = value; break;
      case "message"      : notif.action.message = value; break;
      case "usernames"    : notif.action.usernames = value; break;
      case "description"  : notif.description = value; break;
      case "throttling"   : notif.throttling = value; break;
      case "expires"      : 
        {
          this.setState({expDate: value})
          notif.expires = (new Date(value)).toISOString();       
          break;
        }
    }
    this.setState({notif: notif})
  }

  channels = ["twitter", "sms", "voice"]

  render() {
    
    const actions = [
      <Button color="primary" key="cancel" onTouchTap={()=>{this.props.handleClose(); }}>Cancel</Button>,
      <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.notif); this.props.handleClose();}}>Submit</Button>,
    ];

    console.log("open form" + JSON.stringify(this.state.notif))  
    
    return (
      <Dialog
        actions={actions}
        modal={true}
        open={this.props.modalOpen}>
        <DialogTitle>Create New Notification</DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={5}>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="devices">Devices</InputLabel>
                <Select multiple={true}
                  input={<Input name="devices" id="devices" />}
                  value={this.state.notif.condition.devices} onChange={(s) => this.handleChange("devices", s)} title="The kind of device used for this sensor">
                  {this.state.devices.map(s => <MenuItem key={s.id} checked={this.state.notif.condition.devices.includes(s.id)} value={s.id}>{s.id}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <img src={deviceArrow} width="30" height="30"/>
            </Grid>
            <Grid item xs={5}>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="sensors">Sensors</InputLabel>
                <Select multiple={true}
                  input={<Input name="sensors" id="sensors" />}
                  value={this.state.notif.condition.sensors} onChange={(a) => this.handleChange("sensors", a)}>
                  {this.props.devices.filter(s => this.state.notif.condition.devices.includes(s.id)).map(s => s.sensors.map(m => <MenuItem key={m.id} checked={this.state.notif.condition.sensors.includes(m.id)} value={m.id} >{m.id}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <div className="notifIcon">
                <img src={deviceImage} height="100"/>
                <img src={bellImage} height="24"/>
              </div>
            </Grid>
            <Grid item xs={6}>
              <TextField name="expr" value={this.state.notif.condition.expression} onChange={(e) => this.handleChange("expr", e)}/>
            </Grid>
            <Grid item xs={12}>
              <TextField name="message" fullWidth={true} label="Message to send:" value={this.state.notif.action ? this.state.notif.action.message:null} onChange={(_1, m) => this.handleChange("message", m)}/>
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{display: 'flex'}}>
              <InputLabel htmlFor="usernames">Users</InputLabel>
              <Select multiple={true}
                input={<Input name="usernames" id="usernames" />}
                value={this.state.notif.action ? this.state.notif.action.usernames: null} onChange={(u) => this.handleChange("usernames", u)}>
                {this.props.users && this.props.users.length !=0 ? this.props.users.map(u => 
                  <MenuItem key={u.username} value={u.username} checked={this.state.notif.action ? this.state.notif.action.usernames.includes(u.username): null}>
                 
                  {u.username}
                  </MenuItem>): <br/>
                }
              </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="channels">Socials</InputLabel>
                <Select multiple={true}
                  input={<Input name="channels" id="channels" />}
                  value={this.state.notif.action ? this.state.notif.action.channels : null} onChange={(c) => this.handleChange("channels", c)}>
                  {this.channels.map((c,index) => <MenuItem value={c} key={index} checked={this.state.notif.action ? this.state.notif.action.channels.includes(c) : null} leftIcon={<Socials/>}>{c}</MenuItem>)}
                </Select>
              </FormControl> 
            </Grid>
            <Grid item xs={6}>
            <TextField name="expires" type="date" value={this.state.expDate} onChange={(e) => this.handleChange("expires", e)} style={{display: 'flex'}}>Expires</TextField>
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
    notif: PropTypes.object,  //Should be a Waziup.Notif
    modalOpen: PropTypes.bool,
    devices: PropTypes.array,
    users: PropTypes.array,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}

export default reduxForm({
    form: 'simple'
})(NotifForm)


