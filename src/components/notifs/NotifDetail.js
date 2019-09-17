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

    if (this.props.notif) {
      renderElement = (
        <Container fluid>
          <Hidden mdUp implementation="css">
            <h1 className="page-title"> Notification: {((notifId).length > maxlimit) ? (((notifId).substring(0, maxlimit - 3)) + '...') : notifId} </h1>
          </Hidden>
          <Hidden smDown implementation="css">
            <h1 className="page-title"> Notification: {notifId} </h1>
          </Hidden>
          <Card className="notifDetails">
            <Typography variant="h6">Notification</Typography>
            <NotifCard
              className="deviceNode"
              deleteNotif={(id) => {this.props.deleteNotif(id); browserHistory.push('/notifications');}}
              isEditable
              notif={this.props.notif}
            />
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
  return { notif : state.notification.notification};
}

const mapDispatchToProps = {
  getNotif,
  deleteNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
