import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { getNotifs } from '../../actions/actions.js';
import { connect } from 'react-redux';
import NotifCard from './NotifCard.js';

class NotifDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    this.props.getNotifs();
  }

  render() {
    return (
      <div className="sensor">
        <Container fluid={true}>
        <h1 className="page-title">Notification: {this.state.id}</h1>
          <Card className="sensorMap">
            <CardTitle title="Notification" />
              <NotifCard className="sensorNode" notif={this.props.notif} isEditable={true}/>
          </Card>
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const notif = state.notifications.notifications.find(n => n.id === ownProps.params.notifId)
   return {
      user: state.keycloak.idTokenParsed,
      notif: notif,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNotifs: (user) => {dispatch(getNotifs(user)) }, 
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
