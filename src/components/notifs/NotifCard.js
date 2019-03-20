import React, { Component } from 'react';
import sensorImage from '../../images/gauge.png';
import bellImage from '../../images/bell-icon.png';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Link } from 'react-router';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Person from '@material-ui/icons/Person';
import Share from '@material-ui/icons/Share';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

export default class NotifCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  render() {
    let notif = this.props.notif
    let notifName = notif.condition.sensors + '->' + notif.condition.measurements
    let maxlimit = 20;

    return (
      <Card className="card">
        <div className="TypographyDiv">
          <Hidden mdUp implementation="css">
            <pre className="Typography"> {((notifName).length > maxlimit) ? (((notifName).substring(0, maxlimit - 3)) + '...') : notifName} </pre>
          </Hidden>
          <Hidden smDown implementation="css">
            <pre className="Typography"> {notifName} </pre>
          </Hidden>
          <div className="cardTitleIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => {if(window.confirm('Delete notification?')) this.props.deleteNotif(notif.id)}}/>: null }
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
                <h3> {(notif.condition.expression? notif.condition.expression: "")} </h3>
              </div>
            </div>  
            <div className="notifMsg">
              <pre> {notif.notification.message} </pre>
            </div> 
            <div className="notifUsersChannels">
              <Grid container direction="row" justify="flex-start" alignItems="center" spacing={24}>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <List className="notifUsers">
                      {notif.notification.usernames.map((u,index) => <ListItem key={index}>
                      <ListItemIcon><Person/></ListItemIcon>{u}</ListItem>)}
                  </List>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                  <List className="notifChannels">
                      {notif.notification.channels.map((c,index) => <ListItem key={index}>
                        <ListItemIcon><Share/></ListItemIcon>
                          {c}</ListItem>)}
                  </List>
                </Grid>
              </Grid>
            </div>
          </Link>
        </div>
      </Card>
    );
  }
  
  static propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
    isEditable: PropTypes.bool,
    deleteNotif: PropTypes.func
  }
}

