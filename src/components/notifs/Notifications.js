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
  createNotif, getNotifs, getSensors, getUsers,
} from '../../actions/actions.js';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillMount() {
    this.props.getSensors({ limit: 1000 });
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
              className="sensorNode"
              isEditable={false}
              notif={notif}
            />
          </Link>
        );
        notifications.push(card);
      }
      console.log(`open${JSON.stringify(this.state.modalOpen)}`);
      return (
        <Container fluid>
          <h1 className="page-title">
Notifications settings
          </h1>
          <NotifForm
            handleClose={() => this.setState({ modalOpen: false })}
            modalOpen={this.state.modalOpen}
            onSubmit={this.props.createNotif}
            sensors={this.props.sensors}
            users={this.props.users}
          />
          <Card className="sensorNode">
            <Typography>
              <span className="Typography">
                {' '}
Notifications
                {' '}
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
        {' '}
Notifications loading...
        {' '}
      </h1>;
  }
}

function mapStateToProps(state) {
  console.log(`state:${JSON.stringify(state.notifications)}`);
  return {
    notifications: state.notifications.notifications,
    sensors: state.sensors.sensors,
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
    getSensors: (params) => {
      dispatch(getSensors(params));
    },
    getUsers: () => {
      dispatch(getUsers());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
