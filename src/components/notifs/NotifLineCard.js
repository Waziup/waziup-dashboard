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
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import CardContent from '@material-ui/core/CardContent';

export default class NotifLineCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let notif = this.props.notif
    return (
      <Card className="card" style={{width:'100%'}}>
        <span className="Typography"> {notif.description} </span>
        <div className="contentCards">
          <Grid container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={24}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className="boardIcon">
                <img src={bellImage} height="60"/>
                <br/>
                <pre>
                  {notif.owner ? "owner: " + notif.owner + (this.props.user && notif.owner == this.props.user.username ? " (you)" : "") : ""} 
                </pre>
                <pre>
                  {"ID: " + notif.id}
                </pre>
              </div>
            </Grid>
            <Card className="notifBlock">
              <div className="notifSubject">
                <pre>
                  {notif.condition.devices + ' -> ' + notif.condition.sensors}
                </pre>
              </div>
              <CardContent>
                <div className='notifIcon'>
                  <img src={gaugeImage} height="70"/>
                </div>
                <div className="notifExpr"> 
                  {notif.condition.expression? notif.condition.expression: ""}
                </div>
              </CardContent>
            </Card>  
          </Grid>
        </div>
      </Card>
    );
  }
  
  static propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
  }
}

