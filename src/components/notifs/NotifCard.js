import React, { Component } from 'react';
import deviceImage from '../../images/gauge.png';
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
import Group from "@material-ui/icons/Group";
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
    let notifName = notif.condition.devices + '->' + notif.condition.sensors
    let maxlimit = 20;

    return (
      <Card className="card" style={{maxWidth:'500px'}}>
        <div className="TypographyDiv">
          <Hidden mdUp implementation="css">
            <pre className="Typography"> {((notifName).length > maxlimit) ? (((notifName).substring(0, maxlimit - 3)) + '...') : notifName} </pre>
          </Hidden>
          <Hidden smDown implementation="css">
            <pre className="Typography"> {/*{notifName}*/} </pre>
          </Hidden>
          <div className="cardTitleIcons">
            {this.props.isEditable ? (<EditIcon onClick={() => this.setState({ modalEdit: true })} />) : null}
            {this.props.isEditable ? (<DeleteIcon onClick={() => {if (window.confirm("Delete notification?")) this.props.deleteNotif(notif.id)}} />) : null}
          </div>
        </div>
        <div className="cardContent">
        <Link to={this.props.isEditable ? "/notifications/" + notif.id : ""}>
            <div class="">
              <div class="notif-contents">
                <div class="notif-contents-left">
                  <div>
                    <img src={bellImage} height="80" className="sensor-icon" />
                    <img src={deviceImage} height="32" style={{ left: "20" }} />
                  </div>
                </div>
                <div class="notif-contents-right">
                  <div style={{ fontSize: 25 }}>
                    {" "}
                    {notif.condition.expression
                      ? notif.condition.expression
                      : ""}{" "}
                  </div>
                  <div style={{ fontSize: 16, padding: "10px 10px 10px 0px" }}>
                    {" "}
                    {notif.action.value.message.length > 20
                      ? notif.action.value.message.substring(0, 50) + "..."
                      : notif.action.value.message}{" "}
                  </div>
                </div>
              </div>
              <div className="notifUsersChannels">
                <Grid container direction="row">
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <List className="notifUsers">
                      {notif.action.value.usernames.length !== 0 ? (
                        <ListItem>
                          <ListItemIcon>{notif.action.value.usernames.length > 1 ? <Group /> : <Person /> }</ListItemIcon>
                          {notif.action.value.usernames[0]}
                        </ListItem>
                      ) : (
                        <ListItem>
                          <ListItemIcon>
                            <Person />
                          </ListItemIcon>
                          no user
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <List className="notifChannels">
                      {notif.action.value.channels.length !== 0 ? (
                        <ListItem>
                          <ListItemIcon>
                            <Share />
                          </ListItemIcon>
                          {notif.action.value.channels.map(
                            (c, index) => c + "   "
                          )}
                        </ListItem>
                      ) : (
                        <ListItem>
                          <ListItemIcon>
                            <Share />
                          </ListItemIcon>
                          no channel
                        </ListItem>
                      )}
                    </List>
                  </Grid>
                </Grid>
              </div>
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

