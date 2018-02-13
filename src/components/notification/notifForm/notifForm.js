import React, {Component} from 'react';
import { reduxForm, Field, FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import UTIL from '../../../lib/utils.js';
import MenuItem from 'material-ui/MenuItem'
import DropDownMenu from 'material-ui/DropDownMenu'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField';
import Menu from 'material-ui/Menu';
import {List, ListItem} from 'material-ui/List';
import { Row, Col } from 'react-grid-system'
import sensorImage from '../../../images/gauge.png';
import sensorArrow from '../../../images/sensorArrow.png';
import Paper from 'material-ui/Paper';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Socials from 'material-ui/svg-icons/social/share';
import Checkbox from 'material-ui/Checkbox';


class NotifForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      notif: {
        desc: "Send text message",
        sensors: [],
        attrs: [],
        expr: "SM1>400",
        usernames: [],
        channels: ["Facebook"],
        message: "Waziup: Field is too dry. ${id} humidity value is ${SM1}",
        expires: new Date("2040-05-24T20:00:00.00Z"), 
        throttling: 1
      }
    };
    console.log("users:" + JSON.stringify(props.users))
  }

  handleChange = (formData) => {
    var notif = this.state.notif
    notif[formData.target.name] = formData.target.value;
    this.setState({notif: notif})
  }

  handleChangeSensors = (event, index, value) => {
    var notif = this.state.notif
    notif.sensors = value;
    this.setState({notif: notif});
  }

  handleChangeAttrs = (event, index, value) => {
    var notif = this.state.notif
    notif.attrs = value;
    this.setState({notif: notif});
  }

  handleChangeDate = (event, date) => {
    var notif = this.state.notif
    notif.expires = date;
    this.setState({notif: notif});
  }

  handleChangeUsers = (event, index, value) => {
    console.log("users:" + JSON.stringify(value))
    var notif = this.state.notif
    notif.usernames = value;
    this.setState({notif: notif});
  }

  handleChangeChannels = (event, index, value) => {
    var notif = this.state.notif
    notif.channels = value;
    this.setState({notif: notif});
  }

  channels = ["facebook","twitter"]

  render() {
    const {reset, modalOpen, handleClose, onSubmit, sensors} = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          this.props.onSubmit(this.state.notif);
          handleClose();
        }}
      />,
    ];


    function uniq(a) {
      return a.sort().filter(function(item, pos, array) {
        return !pos || item !== array[pos - 1];
      })
    }
    
    const menuStyle = {
        display: 'inline-block',
        margin: '16px 32px 16px 0',
    };


    return (
      <Dialog title="Create New Notification"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'notifFormDialog'}>
        <form onSubmit={onSubmit}>
          <div className="notif">
            <div className="notifSubject" >
              <div className="notifSensorIcon">
                <img src={sensorImage} width="100" height="100"/>
              </div>
              <div className="notifExpr">
                <TextField name="expr" value={this.state.notif.expr} onChange={this.handleChange}/>
              </div>
            </div>
            <div className="notifSensorAttrs">
              <div className="notifSensors">
                <SelectField name="sensors" multiple={true} value={this.state.notif.sensors} onChange={this.handleChangeSensors} hintText='My Sensor'>
                  {sensors.map(s => <MenuItem key={s.id} insetChildren={true} checked={this.state.notif.sensors.includes(s.id)} value={s.id} primaryText={s.id} />)}
                </SelectField>
              </div>
              <div className="notifArrow">
                <img src={sensorArrow} width="30" height="30"/>
              </div>
              <div className="notifAttrs">
                <SelectField name="attrs" multiple={true} hintText="My sensor value" value={this.state.notif.attrs} onChange={this.handleChangeAttrs}>
                  {sensors.filter(s => this.state.notif.sensors.includes(s.id)).map(s => s.measurements.map(m => <MenuItem key={m.id} insetChildren={true} checked={this.state.notif.attrs.includes(m.id)} value={m.id} primaryText={m.id} />))}
                </SelectField>
              </div>
            </div>
            <div className="notifMsgRow">
              <div className="notifMsg">
                <TextField name="message" fullWidth={true} hintText="message" floatingLabelText="Message to send:" value={this.state.notif.message} onChange={this.handleChange}/>
              </div> 
            </div>
            <div className="notifUsersChannels">
              <div className="notifUsernames">
                <SelectField name="usernames" multiple={true} value={this.state.notif.usernames} onChange={this.handleChangeUsers} hintText="Users">
                  {this.props.users && this.props.users.length !=0 ? this.props.users.map(u => 
                     <MenuItem key={u.username} value={u.username} primaryText={u.username} insetChildren={true} checked={this.state.notif.usernames.includes(u.username)} leftIcon={<PersonAdd/>} />): <br/>}
                </SelectField>
              </div>
              <div className="notifChannels">
                <SelectField name="channels" multiple={true} hintText="Socials" value={this.state.notif.channels} onChange={this.handleChangeChannels}>
                  {this.channels.map(c => <MenuItem value={c} primaryText={c} checked={this.state.notif.channels.includes(c)} leftIcon={<Socials/>}/>)}
                </SelectField>
              </div>
            </div>
            <div className="notifMisc">
              <div className="notifExpires">
                <DatePicker name="expires" hintText="Expires" floatingLabelText="Expires" value={this.state.notif.expires} onChange={this.handleChangeDate}/>
              </div>
              <div className="notifDesc">
                <TextField name="desc" fullWidth={true} floatingLabelText="Description" value={this.state.notif.desc} onChange={this.handleChange}/>
              </div>
            </div>
          </div>
        </form>
      </Dialog>
    );
  }
}

export default reduxForm({
    form: 'simple'
})(NotifForm)


