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
import { Typography } from '@material-ui/core';

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
      <Card style={{ maxWidth:'250pt', marginBottom:10, marginRight:5, marginLeft:10, padding:10, display: 'inline-block',}}>
        <Grid container>
            <Grid item xs={12} style={{marginBottom:10}}><Typography variant='body1'>{notifName} </Typography></Grid>

            <Grid item xs={3}> <img src={bellImage} style={{height:'10vh'}} className="sensor-icon" /> </Grid>
            <Grid item xs={9}>
              <Typography variant='h3'>{notif.condition.expression ? notif.condition.expression : " "}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1'>
              { notif.action.value.message && (notif.action.value.message.length > 20)
                      ? notif.action.value.message.substring(0, 45) + "..."
                      : notif.action.value.message}
              </Typography>
            </Grid>

        </Grid>
      </Card>
    );
  }
  
  static propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
    isEditable: PropTypes.bool,
    deleteNotif: PropTypes.func
  }
}