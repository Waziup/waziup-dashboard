import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NotifForm from './NotifForm.js';
import NotifLineCard from './NotifLineCard.js';
import {
  createNotif, getNotifs, deleteNotif, getDevices, getUsers,
} from '../../actions/actions.js';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import notificationImage from '../../images/bell-icon.png';
import config from '../../config';

class Notifs extends Component {
  
  interval = null;
  
  constructor(props) {
    super(props);
    this.state = { modalOpen: false };
  }

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getNotifs();
    this.props.getUsers();
    this.interval = setInterval(() => {
      this.props.getDevices({ limit: 1000 });
      this.props.getNotifs();
      this.props.getUsers();
    }, config.delayRefresh);
}

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <Container fluid>
        <AppBar position="static"
                style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
            <img src={notificationImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Notifications       
            </Typography>
          </Toolbar>
        </AppBar>
        <NotifForm modalOpen={this.state.modalOpen}
                   devices={this.props.devices}
                   users={this.props.users}
                   handleClose={() => this.setState({ modalOpen: false })}
                   onSubmit={this.props.createNotif} />
        <Typography>
          <a href={config.docServerUrl + "/notifs"}> How to create a notification? </a>
        </Typography>
        <Button className="addDeviceButton"
                onTouchTap={() => this.setState({ modalOpen: true })}
                color="primary"
                variant="contained">
          Add notification
        </Button>
        <div style={{marginTop: '20px', clear: 'both'}}>
          {this.props.notifications.map((notif) => { return (
            <Link to={`/notifications/${notif.id}`} key={notif.id} style={{'text-decoration-line':'unset'}}>
              <NotifLineCard notif={notif}/>
            </Link>
          )})}
        </div>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    notifications: state.notifications.notifications,
    devices: state.settings.showPublicResources ? state.devices.devices : state.devices.devices.filter(d => d.owner == state.current_user.username),
    users: state.settings.showPublicResources ? state.users.users : [state.current_user]
  };
}

const mapDispatchToProps = {
  getNotifs,
  deleteNotif,
  createNotif,
  getDevices,
  getUsers
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifs);
