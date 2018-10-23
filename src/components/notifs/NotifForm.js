import React, {Component} from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import {List, ListItem} from 'material-ui/List';
import { Row, Col } from 'react-grid-system'
import sensorImage from '../../images/gauge.png';
import sensorArrow from '../../images/sensorArrow.png';
import bellImage from '../../images/bell-icon.png';
import Paper from 'material-ui/Paper';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Socials from 'material-ui/svg-icons/social/share';
import Checkbox from 'material-ui/Checkbox';
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'

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
      notif: props.notif? props.notif: defaultNotif
    };
    console.log("users:" + JSON.stringify(props.users))
  }

  handleChange = (field, value) => {
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
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{this.props.handleClose(); }}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.notif); this.props.handleClose();}}/>,
    ];

    console.log("open form" + JSON.stringify(this.state.notif))  
    
    return (
      <Dialog title="Create New Notification"
              actions={actions}
              modal={true}
              open={this.props.modalOpen}>
          <div className="notif">
            <div className="notifSensorAttrs">
              <div className="notifSensors">
                <SelectField name="sensors" multiple={true} value={this.state.notif.condition.sensors} onChange={(_1, _2, s) => this.handleChange("sensors", s)} hintText='My Sensor'>
                  {this.props.sensors.map(s => <MenuItem key={s.id} insetChildren={true} checked={this.state.notif.condition.sensors.includes(s.id)} value={s.id} primaryText={s.id} />)}
                </SelectField>
              </div>
              <div className="notifArrow">
                <img src={sensorArrow} width="30" height="30"/>
              </div>
              <div className="notifAttrs">
                <SelectField name="measurements" multiple={true} hintText="My sensor value" value={this.state.notif.condition.measurements} onChange={(_1, _2, a) => this.handleChange("measurements", a)}>
                  {this.props.sensors.filter(s => this.state.notif.condition.sensors.includes(s.id)).map(s => s.measurements.map(m => <MenuItem key={m.id} insetChildren={true} checked={this.state.notif.condition.measurements.includes(m.id)} value={m.id} primaryText={m.id} />))}
                </SelectField>
              </div>
            </div>
            <div className="notifSubject" >
              <div className="notifIcon">
                <img src={sensorImage} height="100"/>
                <img src={bellImage} height="24"/>
              </div>
              <div className="notifExpr">
                <TextField name="expr" value={this.state.notif.condition.expression} onChange={(_1, e) => this.handleChange("expr", e)}/>
              </div>
            </div>
            <div className="notifMsgRow">
              <div className="notifMsg">
                <TextField name="message" fullWidth={true} hintText="message" floatingLabelText="Message to send:" value={this.state.notif.notification.message} onChange={(_1, m) => this.handleChange("message", m)}/>
              </div> 
            </div>
            <div className="notifUsersChannels">
              <div className="notifUsers">
                <SelectField name="usernames" multiple={true} value={this.state.notif.notification.usernames} onChange={(_1, _2, u) => this.handleChange("usernames", u)} hintText="Users">
                  {this.props.users && this.props.users.length !=0 ? this.props.users.map(u => 
                     <MenuItem key={u.username} value={u.username} primaryText={u.username} insetChildren={true} checked={this.state.notif.notification.usernames.includes(u.username)} leftIcon={<PersonAdd/>} />): <br/>}
                </SelectField>
              </div>
              <div className="notifChannels">
                <SelectField name="channels" multiple={true} hintText="Socials" value={this.state.notif.notification.channels} onChange={(_1, _2, c) => this.handleChange("channels", c)}>
                  {this.channels.map(c => <MenuItem value={c} primaryText={c} checked={this.state.notif.notification.channels.includes(c)} leftIcon={<Socials/>}/>)}
                </SelectField>
              </div>
            </div>
            <div className="notifMisc">
              <div className="notifExpires">
                <DatePicker name="expires" hintText="Expires" floatingLabelText="Expires" value={this.state.notif.expires} onChange={(_1, e) => this.handleChange("expires", e)}/>
              </div>
            </div>
          </div>
      </Dialog>
    );
  }

  propTypes = {
    notif: PropTypes.object.isRequired,  //Should be a Waziup.Notif
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


