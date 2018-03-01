import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { getNotifs, deleteNotif } from '../../actions/actions.js';
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
    
    let renderElement = <h1> loading notification view... </h1>;
    if (this.props.notif) {
      renderElement = 
        <Container fluid={true}>
        <h1 className="page-title">Notification: {this.props.params.notifId}</h1>
          <Card className="notifDetails">
            <CardTitle title="Notification" />
              <NotifCard className="sensorNode" 
                         notif={this.props.notif}
                         isEditable={true}
                         deleteNotif={this.props.deleteNotif}/>
          </Card>
        </Container>
    }
    return (
      <div className="sensor">
        {renderElement}
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
      deleteNotif: (notifId) => {dispatch(deleteNotif(notifId)) },
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotifDetail);
