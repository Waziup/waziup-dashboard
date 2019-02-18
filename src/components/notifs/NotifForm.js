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
import sensorImage from '../../images/gauge.png';
import sensorArrow from '../../images/sensorArrow.png';
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
      condition: { sensors: [], measurements: [], expression: "SM1>40"},
      notification: {channels: [], message: "Waziup: Field is too dry. ${id} humidity value is ${SM1}", usernames: []},
      description: "Waziup notification",
      throttling: 1,
      expires: ""})
    this.state = {
      notif: props.notif? props.notif: defaultNotif,
      sensors: []
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
    let sensors =  this.props.sensors.sort(this.compare);
    this.setState({sensors:sensors })
    console.log(sensors);
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var notif = this.state.notif
    switch (field) {
      case "sensors"      : notif.condition.sensors = value; break;
      case "measurements" : notif.condition.measurements = value; break;
      case "expr"         : notif.condition.expression = value; break;
      case "channels"     : notif.notification.channels = value; break;
      case "message"      : notif.notification.message = value; break;
      case "usernames"    : notif.notification.usernames = value; break;
      case "description"  : notif.description = value; break;
      case "throttling"   : notif.throttling = value; break;
      case "expires"      : notif.expires = value; break;
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
                <InputLabel htmlFor="sensors">Sensors</InputLabel>
                <Select multiple={true}
                  input={<Input name="sensors" id="sensors" />}
                  value={this.state.notif.condition.sensors} onChange={(s) => this.handleChange("sensors", s)} title="The kind of sensor used for this measurement">
                  {this.state.sensors.map(s => <MenuItem key={s.id} checked={this.state.notif.condition.sensors.includes(s.id)} value={s.id}>{s.id}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <img src={sensorArrow} width="30" height="30"/>
            </Grid>
            <Grid item xs={5}>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="measurements">Measurements</InputLabel>
                <Select multiple={true}
                  input={<Input name="measurements" id="measurements" />}
                  value={this.state.notif.condition.measurements} onChange={(a) => this.handleChange("measurements", a)}>
                  {this.props.sensors.filter(s => this.state.notif.condition.sensors.includes(s.id)).map(s => s.measurements.map(m => <MenuItem key={m.id} checked={this.state.notif.condition.measurements.includes(m.id)} value={m.id} >{m.id}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <div className="notifIcon">
                <img src={sensorImage} height="100"/>
                <img src={bellImage} height="24"/>
              </div>
            </Grid>
            <Grid item xs={6}>
              <TextField name="expr" value={this.state.notif.condition.expression} onChange={(e) => this.handleChange("expr", e)}/>
            </Grid>
            <Grid item xs={12}>
              <TextField name="message" fullWidth={true} label="Message to send:" value={this.state.notif.notification.message} onChange={(_1, m) => this.handleChange("message", m)}/>
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{display: 'flex'}}>
              <InputLabel htmlFor="usernames">Users</InputLabel>
              <Select multiple={true}
                input={<Input name="usernames" id="usernames" />}
                value={this.state.notif.notification.usernames} onChange={(u) => this.handleChange("usernames", u)}>
                {this.props.users && this.props.users.length !=0 ? this.props.users.map(u => 
                  <MenuItem key={u.username} value={u.username} checked={this.state.notif.notification.usernames.includes(u.username)}>
                 
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
                  value={this.state.notif.notification.channels} onChange={(c) => this.handleChange("channels", c)}>
                  {this.channels.map((c,index) => <MenuItem value={c} key={index} checked={this.state.notif.notification.channels.includes(c)} leftIcon={<Socials/>}>{c}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <TextField name="expires" type="date" value={this.state.notif.expires} onChange={(e) => this.handleChange("expires", e)} style={{display: 'flex'}}>Expires</TextField>
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
    sensors: PropTypes.array,
    users: PropTypes.array,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}

export default reduxForm({
    form: 'simple'
})(NotifForm)


