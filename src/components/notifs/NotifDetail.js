import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { deleteNotif, getNotifs } from '../../actions/actions.js';
import NotifCard from './NotifCard.js';

class NotifDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.getNotifs();
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
loading notification view...
        {' '}
      </h1>
    );
    if (this.props.notif) {
      renderElement = (
        <Container fluid>
          <h1 className="page-title">
Notification:
            {this.props.params.notifId}
          </h1>
          <Card className="notifDetails">
            <Typography variant="h6">Notification</Typography>
            <NotifCard
              className="sensorNode"
              deleteNotif={this.props.deleteNotif}
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
      <div className="sensor">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const notif = state.notifications.notifications.find(n => n.id === ownProps.params.notifId);
  return { notif };
}

function mapDispatchToProps(dispatch) {
  return {
    getNotifs: (user) => {
      dispatch(getNotifs(user));
    },
    deleteNotif: (notifId) => {
      dispatch(deleteNotif(notifId));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
