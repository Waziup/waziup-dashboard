import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NotifForm from './NotifForm.js';
import NotifCard from './NotifCard.js';
import {
  createNotif, getNotifs, getDevices, getUsers,
} from '../../actions/actions.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import notificationImage from '../../images/notification.png';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getNotifs();
    this.props.getUsers();
  }

  render() {
    console.log(`notifs:${JSON.stringify(this.props.notifications)}`);
    const data = this.props.notifications;
    const notifications = [];
    if (this.props.notifications) {
      for (const notif of this.props.notifications) {
        const card = (
          <Link to={`/notifications/${notif.id}`} key={notif.id}>
            <NotifCard
              className="deviceNode"
              isEditable={false}
              notif={notif}
            />
          </Link>
        );
        notifications.push(card);
      }
      console.log(`open${JSON.stringify(this.state.modalOpen)}`);
      return (
        <Container fluid={true} style={{'paddingBottom':'50px'}}>
          <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
            <Toolbar>
            <img src={notificationImage} height="50"/>
              <Typography variant="h5" className="page-title">
              Notifications settings       
              </Typography>
            </Toolbar>
          </AppBar>
          <NotifForm modalOpen={this.state.modalOpen}
                     devices={this.props.devices}
                     users={this.props.users}
                     handleClose={() => this.setState({ modalOpen: false })}
                     onSubmit={this.props.createNotif} />
          <Card className="deviceNode">
            <Typography>
              <span className="Typography">
                Notifications
              </span>
              <Button
                className="topRightButton"
                onTouchTap={() => this.setState({ modalOpen: true })}
                color="primary"
                variant="contained"
              >Add notification</Button>
            </Typography>
            <div className="contentCards">
              {notifications}
            </div>
          </Card>
        </Container>
      );
    }
      <h1>
      Notifications loading...
      </h1>;
  }
}

function mapStateToProps(state) {
  console.log(`state:${JSON.stringify(state.notifications)}`);
  return {
    notifications: state.notifications.notifications,
    devices: state.devices.devices,
    users: state.users.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNotifs: (user) => {
      dispatch(getNotifs());
    },
    deleteNotif: (notifId) => {
      dispatch(deleteNotif(notifId));
    },
    createNotif: (notif) => {
      dispatch(createNotif(notif));
    },
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
    getUsers: () => {
      dispatch(getUsers());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
