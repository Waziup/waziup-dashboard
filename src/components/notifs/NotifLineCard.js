import React, { Component } from 'react';
import deviceImage from '../../images/gauge.png';
import gaugeImage from '../../images/gauge.png';
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
import Chip from '@material-ui/core/Chip';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CardContent from '@material-ui/core/CardContent';

import robotArmICO from '../../images/robot-arm-ico.png'
import twitterICO from '../../images/twitter-ico.png'

export default class NotifLineCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let notif = this.props.notif
    return (
      <Card className="longCard">
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
          <span className="Typography">
          {notif.description}  {"  "}  {notif.action.type === 'SocialAction' ? <img src={twitterICO} height="20"/> : <img src={robotArmICO} height="20"/>}
              
            </span>
          <div className="notifSubject" style={{marginRight:20}}>
            {notif.status === 'expired'? <Chip icon={<AlarmOffIcon />} label="EXPIRED" color="#FF0000" />: null}
          </div>
        </div>
        <div className="contentCards">
          <Grid container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={24}>

            <div style={{display:'flex' ,alignItems:'center'}}>
              <div className='notifIcon'>
                <img src={gaugeImage} height="70"/>
              </div>
              <div className="notifExpr" style={{margin:'auto', padding:'10px'}}> 
                {notif.condition.expression? notif.condition.expression: ""}
              </div>
            </div>
          </Grid>
        </div>
      </Card>
    );
  }
  
  static propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
  }
}

