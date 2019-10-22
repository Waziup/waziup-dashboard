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

class NotifDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

    if (this.props.notif) {
      renderElement = (
        <Container fluid>
          <AppBar position="static"
                  style={{marginBottom: '30px',background: '#e9edf2'}}>
            <Toolbar>
              <img src={notificationImage} height="50"/>
              <Typography variant="h5" className="page-title">
                Notification {notif.id}
              </Typography>
              <div style={{'margin-left': 'auto'}}> 
                <EditIcon onClick={() => this.setState({modalEdit: true})}/>
                <DeleteIcon onClick={() => {if(window.confirm('Delete notification?')) this.props.deleteNotif(notif.id)}}/>
              </div>
            </Toolbar>
          </AppBar>
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <img src={deviceImage} height="54"/>
              <Typography variant="h6"> Condition </Typography>
            </div>
            <CardContent>
              <h4 title="Short description for your notification"> 
                {"Description: " + this.props.notif.description}
              </h4>
              <h4 title="The sensor that we'll observe"> 
                {"Sensor: " + this.props.notif.condition.devices + " -> " + this.props.notif.condition.sensors}
              </h4>
              <h4 title="The expression that will trigger this notification. For example: 'TC>15' means that if the sensor 'TC' measures a temperature of more than 15°C, the notification will     be triggered. ATTENTION: the sensor in the expression (here 'TC') MUST match the sensor selected above."> 
                {notif.condition.expression? "Expression: " + notif.condition.expression : ""}
              </h4>
            </CardContent>
          </Card>
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <img src={bellImage} height="48"/>
              <Typography variant="h6"> Action </Typography>
            </div>
            <CardContent>
              <h4 title="The message to be sent to you when the notification is triggered. You can use ${<sensorID>} to mention the sensor measurement in the message. For example, ${TC} will in    sert the temperature value of your sensor 'TC'."> 
                {"Message: " + notif.action.message}
              </h4>
              <h4 title="To whom this notification should be sent to?"> 
                {"Users: " + notif.action.usernames}
              </h4>
              <h4 title="On which channels should we send this notification?">
                {"Channels: " + notif.action.channels}
              </h4>
            </CardContent>
          </Card>
          <Card className="notifBloc">
            <div className="notifBlocTitle">
              <Typography variant="h6"> Status </Typography>
            </div>
            <CardContent>
                {notif.status ?              <h4> {"Status: "              + notif.status} </h4> : null}
                {notif.times_sent ?          <h4> {"Times sent: "          + notif.times_sent} </h4> : <h4> Never sent </h4>}
                {notif.last_success ?        <h4> {"Last success: "        + notif.last_success} </h4> : null}
                {notif.last_success_code ?   <h4> {"Last success code: "   + notif.last_success_code} </h4> : null}
                {notif.last_failure ?        <h4> {"Last failure: "        + notif.last_failure} </h4> : null}
                {notif.last_failure_reason ? <h4> {"Last failure reason: " + notif.last_failure_reason} </h4> : null}
                {notif.last_notif ?          <h4> {"Last notification: "   + notif.last_notif} </h4> : null}
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
    notif : state.notification.notification
  };
}

const mapDispatchToProps = {
  getNotif,
  deleteNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
