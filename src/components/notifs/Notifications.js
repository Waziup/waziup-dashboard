import React, { Component } from 'react';
import { Container } from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardTitle, CardActions, CardContent } from 'material-ui/Card';
import NotifForm from './NotifForm.js';
import NotifCard from './NotifCard.js';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import NotifActions from './NotifActions.js';
import { connect } from 'react-redux';
import Utils from '../../lib/utils';
import * as Waziup from 'waziup-js'
import { getSensors, getNotifs, createNotif, deleteNotifs, getUsers } from '../../actions/actions.js';
import { Link } from 'react-router';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      isCardsView: true
    };
  }

  componentWillMount() {
    this.props.getSensors();
    this.props.getNotifs();
    this.props.getUsers();
  }

  render() {
    console.log("notifs:" + JSON.stringify(this.props.notifications));
    let data = this.props.notifications
    var notifications = []
    if(this.props.notifications) {
      for(var notif of this.props.notifications) {
         const card = 
           <Link to={"/notifications/" + notif.id} > 
             <NotifCard className="sensorNode"
                        notif={notif}
                        isEditable={false}/>
           </Link>
         notifications.push(card)
      }
      console.log("open" + JSON.stringify(this.state.modalOpen))  
      return (
        <Container fluid={true}>
          <h1 className="page-title">Notifications settings</h1>
          <NotifForm modalOpen={this.state.modalOpen}
                     sensors={this.props.sensors}
                     users={this.props.users}
                     handleClose={() => this.setState({ modalOpen: false })}
                     onSubmit={this.props.createNotif} />
          <Card className="sensorNode">
            <CardTitle>
              <h2 className="cardTitle"> Notifications </h2>
              <RaisedButton label="Add notification" onTouchTap={() => this.setState({ modalOpen: true })} primary={true} className="topRightButton"/>
            </CardTitle>
            <div className="contentCards">
            {this.state.isCardsView? 
              notifications: 
              null}
            </div>
          </Card>
        </Container>
      );
    } else {
      <h1> Notifications loading... </h1>
    }
  }
}

function mapStateToProps(state) {
     console.log("state:" + JSON.stringify(state.notifications))
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
      sensors: state.sensors.sensors,
      users: state.users.users
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNotifs: (user) => {dispatch(getNotifs()) }, 
      deleteNotif: (notifId) => {dispatch(deleteNotif(notifId)) },
      createNotif: (notif) => {dispatch(createNotif(notif)) }, 
      getSensors: () => {dispatch(getSensors()) },
      getUsers: () => {dispatch(getUsers()) }
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);


