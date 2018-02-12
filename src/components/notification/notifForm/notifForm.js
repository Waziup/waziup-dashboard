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
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col } from 'react-grid-system'

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

    return (
      <Dialog title="Create New Notification"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'notifFormDialog'}>
        <form onSubmit={onSubmit}>
          <Col>
            <Row>
              <DropDownMenu name="sensors" multiple={true} value={this.state.notif.sensors} onChange={this.handleChangeSensors}>
                {sensors.map(s =>  <MenuItem value={s.id} primaryText={s.id} />)}
              </DropDownMenu>
            </Row>
            <Row>
              <DropDownMenu name="attrs" multiple={true} hintText="attributes" floatingLabelText="Attributes" value={this.state.notif.attrs} onChange={this.handleChangeAttrs}>
                {sensors.filter(s => this.state.notif.sensors.includes(s.id)).map(s => s.measurements.map(m => <MenuItem value={m.id} primaryText={m.id} />))}
              </DropDownMenu>
            </Row>
            <Row>
              <TextField name="expr" fullWidth={true} hintText="expression" floatingLabelText="Expression" value={this.state.notif.expr} onChange={this.handleChange}/>
            </Row>
            <Row>
              <TextField name="message" fullWidth={true} hintText="message" floatingLabelText="Message" value={this.state.notif.message} onChange={this.handleChange}/>
            </Row> 
            <Row>
              <DropDownMenu name="usernames" multiple={true} hintText="Users" floatingLabelText="Users" value={this.state.notif.usernames} onChange={this.handleChangeUsers}>
                {this.props.users && this.props.users.length!=0 ? this.props.users.map(u => <MenuItem value={u.username} primaryText={u.username} />): <br/>}
              </DropDownMenu>
            </Row>
            <Row>
              <DropDownMenu name="channels" multiple={true} hintText="Users" floatingLabelText="Channels" value={this.state.notif.channels} onChange={this.handleChangeChannels}>
                {this.channels.map(c => <MenuItem value={c} primaryText={c} />)}
              </DropDownMenu>
            </Row>
            <Row>
              <DatePicker name="expires" hintText="Expires" floatingLabelText="Expires" value={this.state.notif.expires} onChange={this.handleChangeDate}/>
            </Row>
            <Row>
              <TextField name="desc" fullWidth={true} floatingLabelText="Description" value={this.state.notif.desc} onChange={this.handleChange}/>
            </Row>
          </Col>
        </form>
      </Dialog>
    );
  }
}

export default reduxForm({
    form: 'simple'
})(NotifForm)


