import React, {Component} from 'react';
import { reduxForm } from 'redux-form'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
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
import Card from "@material-ui/core/Card";
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import config from '../../config';
import PersonIcon from '@material-ui/icons/Person';
import ShareIcon from '@material-ui/icons/Share';
import MsgIcon from '@material-ui/icons/Textsms';

class NotifForm extends Component {
  constructor(props) {
    super(props);
    console.log("notif before:" + JSON.stringify(props.notif))
    var tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const defaultNotif = {
      condition: { devices: [], sensors: [], expression: "TC1>40"},
      action: {type: "SocialAction", 
               value: {channels: [], message: "Waziup: Field is too dry. ${id} humidity value is ${TC1}", usernames: [],
                       device_id: "MyDevice", actuator_id: "Act1", actuator_value: "${TC1}"}},
      description: "Waziup notification",
      throttling: 1,
      expires: moment(tomorrow).format()}
      this.state = {
        notif: props.notif? props.notif: defaultNotif,
        devices: [],
        search: "",
      };
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
    this.setState({devices: devices })
  }
  
  handleSearchInput = (ev) => {
    this.setState({search: ev.target.value});
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var notif = this.state.notif
    switch (field) {
      case "devices"            : notif.condition.devices = value; break;
      case "sensors"            : notif.condition.sensors = value; break;
      case "expr"               : notif.condition.expression = value; break;
      case "act_type"           : notif.action.type = value; break;
      case "act_channels"       : notif.action.value.channels = value; break;
      case "act_message"        : notif.action.value.message = value; break;
      case "act_usernames"      : notif.action.value.usernames = value; break;
      case "act_device_id"      : notif.action.value.device_id = value; break;
      case "act_actuator_id"    : notif.action.value.actuator_id = value; break;
      case "act_actuator_value" : notif.action.value.actuator_value = value; break;
      case "description"        : notif.description = value; break;
      case "throttling"         : notif.throttling = value; break;
      case "expires"            : notif.expires = moment(new Date(value)).format(); break;
      case "description"        : notif.description = value; break;
    }
    this.setState({notif: notif})
  }

  channels = ["twitter", "sms", "voice"]

  render() {
    
    const actions = [
      <Button color="primary" key="cancel" onTouchTap={()=>{this.props.handleClose(); }}>Cancel</Button>,
      <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.notif); this.props.handleClose();}}>Submit</Button>,
    ];

    console.log(this.state.devices);
    
    //Device list proposed
    let deviceItems = this.state.devices
      .filter(device => {
        if(!this.state.search) return true; // no search string = no filter
        return device.id.toLowerCase().includes(this.state.search.toLowerCase()) ||
          (device.name && device.name.toLowerCase().includes(this.state.search.toLowerCase()))
      })
      .map(device => 
        <MenuItem key={device.id}
                  checked={this.state.notif.condition.devices.includes(device.id)}
                  value={device.id}>
          {device.name || device.id}
        </MenuItem>
      );
    
    //Sensors list on the device selected
    let sensorItems = this.props.devices.filter(s => 
      this.state.notif.condition.devices.includes(s.id)).map(s => 
        s.sensors.map(m => 
          <MenuItem key={m.id}
                    checked={this.state.notif.condition.sensors.includes(m.id)}
                    value={m.id}>
            {m.id}
          </MenuItem>))
   
    //users for Socials
    let userItems = this.props.users && this.props.users.length !=0  ? this.props.users.map(u => 
      <MenuItem key={u.username}
                value={u.username}
                checked={this.state.notif.action.value.usernames ? this.state.notif.action.value.usernames.includes(u.username): null}>
        {u.username}
      </MenuItem>) : <br/>
    
    //channels for socials
    let channelItems = this.channels.map((c,index) => 
      <MenuItem value={c}
                key={index}
                checked={this.state.notif.action.value.channels ? this.state.notif.action.value.channels.includes(c) : null}
                leftIcon={<ShareIcon/>}>
        {c}
      </MenuItem>)

     //devices for actuation action
     let deviceActItems = this.state.devices.map(s =>
       <MenuItem key={s.id}
                 checked={this.state.notif.action.value.device_id == s.id}
                 value={s.id}>
         {s.id}
       </MenuItem>)

      let actuatorItems = this.props.devices.filter(s =>
        this.state.notif.action.value.device_id == s.id).map(s => 
          s.actuators.map(m => 
            <MenuItem key={m.id}
                      checked={this.state.notif.action.value.actuator_id == m.id}
                      value={m.id}>
              {m.id}
            </MenuItem>))      

    return (
      <Dialog actions={actions}
              modal={true}
              open={this.props.modalOpen}
              style={{"padding-right": "50px !important"}}>
        <DialogTitle>
          <Typography variant="h5"> Create a new notification </Typography>
        </DialogTitle>
        <DialogContent>
          <div className="notifExpires">
            <TextField name="description"
                       value={this.state.notif.description}
                       label="Description:"
                       onChange={(e) => this.handleChange("expires", e)}
                       style={{display: 'flex'}}
                       title="Short description for your notification">
              Description
            </TextField>
          </div>
          
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <img src={deviceImage} height="54"/>
              <Typography variant="h6"> Condition </Typography>
            </div>
            <CardContent>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="devices">Devices</InputLabel>
               
                <Select multiple
                        input={<Input name="devices" id="devices" />}
                        value={this.state.notif.condition.devices}
                        onChange={(s) => this.handleChange("devices", s)}
                        title="Device to uses">

                  <TextField name="device" placeholder='device' style={{display: 'flex'}} title="Short description for your notification" onInput={this.handleSearchInput}/>
                  {deviceItems}
                  
                </Select>
              </FormControl>
              <FormControl style={{display: 'flex'}}>
                <InputLabel htmlFor="sensors">Sensors</InputLabel>
                <Select multiple={true}
                        input={<Input name="sensors" id="sensors" />}
                        value={this.state.notif.condition.sensors}
                        onChange={(a) => this.handleChange("sensors", a)}
                        title="The sensor that we'll observe">
                  {sensorItems}
                </Select>
              </FormControl>
              <FormControl style={{display: 'flex'}}>
                <TextField name="expr"
                           value={this.state.notif.condition.expression}
                           onChange={(e) => this.handleChange("expr", e)}
                           label="Expression:"
                           title="The expression that will trigger this notification. For example: 'TC>15' means that if the sensor 'TC' measures a temperature of more than 15°C, the notification will be triggered. ATTENTION: the sensor in the expression (here 'TC') MUST match the sensor selected above."/>
              </FormControl>
            </CardContent>
          </Card>

          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <img src={bellImage} height="48"/>
              <Typography variant="h6" style={{'margin-left':'10px'}}>Action </Typography>
            </div>
            <CardContent>
              <InputLabel htmlFor="actionType">Action type:  &nbsp;&nbsp; </InputLabel>
              <Select multiple={false}
                      input={<Input name="actionType" id="actionType" />}
                      value={this.state.notif.action.type}
                      onChange={(a) => this.handleChange("act_type", a)}
                      title="The type of action to perform">
                <MenuItem key="SocialAction" checked={this.state.notif.action.type == "SocialAction"} value="SocialAction" > Social Network</MenuItem>
                <MenuItem key="ActuationAction" checked={this.state.notif.action.type == "ActuationAction"} value="ActuationAction" > Actuation</MenuItem>
              </Select>

              {this.state.notif.action.type == "SocialAction" ?
                <Card className="notifBloc">
                  <div className="notifBlocTitle">
                    <Typography variant="h6" style={{'margin-left':'10px'}}> Social </Typography>
                  </div>
                  <CardContent>
                  <TextField name="message" 
                             fullWidth={true}
                             label="Message to send:"
                             value={this.state.notif.action.value.message}
                             onChange={(m) => this.handleChange("act_message", m)}
                             title="The message to be sent to you when the notification is triggered. You can use ${<sensorID>} to mention the sensor measurement in the message. For example, ${TC} will insert the temperature value of your sensor 'TC'."/>
                  <FormControl style={{display: 'flex'}}>
                    <InputLabel htmlFor="channels">Socials</InputLabel>
                    <Select multiple={true}
                            input={<Input name="channels" id="channels" />}
                            value={this.state.notif.action.value.channels}
                            onChange={(c) => this.handleChange("act_channels", c)}
                            title="On which channels should we send this notification?">
                      {channelItems}
                    </Select>
                  </FormControl> 
                  </CardContent>
                </Card>
              : 
                <Card className="notifBloc">
                  <div className="notifBlocTitle">
                    <Typography variant="h6" style={{'margin-left':'10px'}}> Actuation </Typography>
                  </div>
                  <CardContent>
                    <FormControl style={{display: 'flex'}}>
                      <InputLabel htmlFor="act_device_id">Device</InputLabel>
                      <Select multiple={false}
                              input={<Input name="act_device_id" id="act_device_id" />}
                              value={this.state.notif.action.value.device_id}
                              onChange={(u) => this.handleChange("act_device_id", u)}
                              title="On which device the actuator is?">
                        {deviceActItems}
                      </Select>
                    </FormControl>
                    <FormControl style={{display: 'flex'}}>
                      <InputLabel htmlFor="channels">Actuator</InputLabel>
                      <Select multiple={false}
                              input={<Input name="act_actuator_id" id="actuator_id" />}
                              value={this.state.notif.action.value.actuator_id}
                              onChange={(c) => this.handleChange("act_actuator_id", c)}
                              title="On which actuator should we send this?">
                        {actuatorItems}
                      </Select>
                    </FormControl> 
                    <TextField name="actuator_value" 
                               fullWidth={true}
                               label="Actuator value:"
                               value={this.state.notif.action.value.actuator_value}
                               onChange={(m) => this.handleChange("act_actuator_value", m)}
                               title="The actuation value. You can use ${<sensorID>} to mention the sensor measurement in the value. For example, ${TC} will insert the temperature value of your sensor 'TC'."/>
                  </CardContent>
                </Card>
              }
            </CardContent>
          </Card>
          
          <div className="notifExpires">
            <TextField name="expires"
                       type="date"
                       value={moment(this.state.notif.expires).format('YYYY-MM-DD')}
                       label="Expires"
                       onChange={(e) => this.handleChange("expires", e)}
                       style={{display: 'flex'}}
                       title="Expiration date for the notification">
              Expires
            </TextField>
          </div>
          <div className="notifInfo">
            Attention: to receive messages on SMS or Twitter, you should register your account in {' '}
            <a href={config.keycloakUrl + '/realms/' + config.realm + '/account?referrer=Dashboard&referrer_uri=' + config.serverUrl}>your Profile</a>.
          </div>
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


