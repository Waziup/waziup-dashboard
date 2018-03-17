import React, { Component } from 'react';
import sensorImage from '../../images/gauge.png';
import bellImage from '../../images/bell-icon.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'
import { Link } from 'react-router';
import {List, ListItem} from 'material-ui/List';
import Person from 'material-ui/svg-icons/social/person';
import Share from 'material-ui/svg-icons/social/share';

export default class NotifCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  render() {
    let notif = this.props.notif
    return (
      <Card className="card">
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {notif.subject.entityNames} -> {notif.subject.condition.attrs} </pre>
          <div className="cardTitleIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => this.props.deleteNotif(notif.id)}/>: null }
          </div>
        </div>
        <div className="cardContent">
          <Link to={this.props.isEditable? "/notifications/" + notif.id: ""} >
            <div className="notifSubject">
              <div className="notifIcon">
                <img src={bellImage} height="80"/>
                <img src={sensorImage} height="32"/>
              </div>
              <div className="notifExpr"> 
                <h3> {(notif.subject.condition.expression? notif.subject.condition.expression: "")} </h3>
              </div>
            </div>  
            <div className="notifMsg">
              <pre> {notif.notification.message} </pre>
            </div> 
            <div className="notifUsersChannels">
              <List className="notifUsers">
                  {notif.notification.usernames.map(u => <ListItem primaryText={u} leftIcon={<Person/>} />)}
              </List>
              <List className="notifChannels">
                  {notif.notification.channels.map(c => <ListItem primaryText={c} leftIcon={<Share/>} />)}
              </List>
            </div>
          </Link>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
    isEditable: PropTypes.bool,
    deleteNotif: PropTypes.func.isRequired
  }
}

