import React, { Component } from 'react';
import bellImage from '../../images/bell-icon.png';
import smsIcon from '../../images/text.png';
import twitterIcon from '../../images/twitter1.png';
import PropTypes from 'prop-types';
import { Typography, Grid, Card  } from '@material-ui/core';

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
            <Grid item xs={9} style={{marginBottom:10}}> <Typography variant='h6'>{notifName} </Typography> </Grid>
            <Grid container xs={3} direction='row' justify='flex-end'>
              <img src={smsIcon} style={{height:'3.2vh', opacity:.7}} />
              <img src={twitterIcon} style={{height:'3vh', opacity:.7}} /> 
            </Grid>

            <Grid item xs={3}> <img src={bellImage} style={{height:'10vh'}} className="sensor-icon" /> </Grid>
            <Grid item xs={9} direction="row" justify="flex-start" alignItems="center">
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