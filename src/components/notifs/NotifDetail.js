import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { deleteNotif, getNotif } from '../../actions/actions.js';
import NotifCard from './NotifCard.js';
import Hidden from '@material-ui/core/Hidden';
import config from '../../config';
import deviceImage from '../../images/gauge.png';
import bellImage from '../../images/bell-icon.png';
import CardContent from '@material-ui/core/CardContent';
import notificationImage from '../../images/bell-icon.png';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import NotifForm from './NotifForm.js';
import PersonIcon from '@material-ui/icons/Person';
import ShareIcon from '@material-ui/icons/Share';
import MsgIcon from '@material-ui/icons/Textsms';

class NotifDetail extends Component {
  
  interval = null;

  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  componentWillMount() {
    this.props.getNotif(this.props.params.notifId);
    this.interval = setInterval(() => {
      this.props.getNotif(this.props.params.notifId);
    }, config.delayRefresh);
  }

componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
        loading notification view...
        {' '}
      </h1>
    );
    let notifId = this.props.params.notifId;
    let maxlimit = 20;
    let notif = this.props.notif;

    if (notif) {
      renderElement = (
        <Container fluid>
          <AppBar position="static"
                  style={{marginBottom: '30px',background: '#e9edf2'}}>
            <Toolbar>
              <img src={notificationImage} height="50"/>
              <Typography variant="h5" className="page-title">
                Notification {notif.id}
              </Typography>
              <NotifForm modalOpen={this.state.modalEdit}
                         devices={this.props.devices}
                         users={this.props.users}
                         handleClose={() => this.setState({ modalEdit: false })}
                         onSubmit={this.props.createNotif} />
              <div style={{'margin-left': 'auto'}}> 
                <EditIcon onClick={() => this.setState({modalEdit: true})}/>
                <DeleteIcon onClick={() => {if(window.confirm('Delete notification?')) this.props.deleteNotif(notif.id); browserHistory.push('/notifications');}}/>
              </div>
            </Toolbar>
          </AppBar>
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <img src={deviceImage} height="54"/>
              <Typography variant="h6"> Condition </Typography>
            </div>
            <CardContent>
              <p title="Short description for your notification"> 
                {"Description: " + this.props.notif.description}
              </p>
              <p title="The sensor that we'll observe"> 
                {"Sensor: " + this.props.notif.condition.devices + " -> " + this.props.notif.condition.sensors}
              </p>
              <p title="The expression that will trigger this notification. For example: 'TC>15' means that if the sensor 'TC' measures a temperature of more than 15°C, the notification will     be triggered. ATTENTION: the sensor in the expression (here 'TC') MUST match the sensor selected above."> 
                {notif.condition.expression? "Expression: " + notif.condition.expression : ""}
              </p>
            </CardContent>
          </Card>

          {notif.action.type == "SocialAction" ?
            <Card className="notifBloc">
              <div className="notifBlocTitle">
                <img src={bellImage} height="48"/>
                <Typography variant="h6"> Social action </Typography>
              </div>
              <CardContent>
                <p title="The message to be sent to you when the notification is triggered. You can use ${<sensorID>} to mention the sensor measurement in the message. For example, ${TC} will in    sert the temperature value of your sensor 'TC'."> 
                  <MsgIcon/>
                  {" Message: " + notif.action.value.message}
                </p>
                <p title="To whom this notification should be sent to?">
                  <PersonIcon/>
                  {" Users: " + notif.action.value.usernames}
                </p>
                <p title="On which channels should we send this notification?">
                  <ShareIcon/>
                  {" Channels: " + notif.action.value.channels}
                </p>
              </CardContent>
            </Card>
          :
            <Card className="notifBloc">
              <div className="notifBlocTitle">
                <img src={bellImage} height="48"/>
                <Typography variant="h6"> Actuation action </Typography>
              </div>
              <CardContent>
                <p title=""> 
                  {" Device: " + notif.action.value.device_id}
                </p>
                <p title="">
                  {" Actuator: " + notif.action.value.actuator_id}
                </p>
                <p title="">
                  {" Actuator value: " + notif.action.value.actuator_value}
                </p>
              </CardContent>
            </Card>
          }
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <Typography variant="h6"> Status </Typography>
            </div>
            <CardContent>
                {notif.status ?              <p> {"Status: "              + notif.status} </p> : null}
                {notif.times_sent ?          <p> {"Times sent: "          + notif.times_sent} </p> : <p> Never sent </p>}
                {notif.last_success ?        <p> {"Last success: "        + notif.last_success} </p> : null}
                {notif.last_success_code ?   <p> {"Last success code: "   + notif.last_success_code} </p> : null}
                {notif.last_failure ?        <p> {"Last failure: "        + notif.last_failure} </p> : null}
                {notif.last_failure_reason ? <p> {"Last failure reason: " + notif.last_failure_reason} </p> : null}
                {notif.last_notif ?          <p> {"Last notification: "   + notif.last_notif} </p> : null}
            </CardContent>
          </Card>
        </Container>
      );
    } else {
      browserHistory.push('/notifications');
    }
    return (
      <div className="device">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { 
    notif : state.notification.notification,
    devices: state.settings.showPublicResources ? state.devices.devices : state.devices.devices.filter(d => d.owner == state.current_user.username),
    users: state.settings.showPublicResources ? state.users.users : [state.current_user]
  };
}

const mapDispatchToProps = {
  getNotif,
  deleteNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
