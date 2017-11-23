import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';

class notifDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      user: props.user
    };
  }

  componentWillMount() {
    this.props.loadNotifs(this.state.user);
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps.notifications:" + JSON.stringify(nextProps.notifications));
    if (nextProps.notifications && this.props.params.notifId) {
      var notifs = nextProps.notifications.find((el) => {
        return el.id === this.props.params.notifId;
      });
      this.setState({ notifications: notifs });
    }
  }

  render() {
    let details = null;
    let subs = this.state.notifications;
    var listItems = [];
    if (subs.id) {

      listItems.push(<ListItem primaryText={"ID: " + subs.id} />)
      if (subs.description)
         listItems.push(<ListItem primaryText={"Description: " + subs.description}/>)
      listItems.push(<ListItem primaryText={"Entities: " + subs.subject.entities.map((e) => e.id).join(", ")}/>)
      if(subs.subject.condition) {
      let cond = subs.subject.condition
        if(cond.attrs)
           listItems.push(<ListItem primaryText={"Condition attributes: " + cond.attrs.join(", ")}/>)
        if(cond.expression) {
          if(cond.expression.q)
            listItems.push(<ListItem primaryText={"Condition expression: " + cond.expression.q}/>)
        }
      }
      let notif = subs.notification
      if(notif.timesSent)
        listItems.push(<ListItem primaryText={"Times sent: " + notif.timesSent}/>)
      if(notif.lastNotification)
        listItems.push(<ListItem primaryText={"Last notification: " + notif.lastNotification}/>)
      if(notif.httpCustom) {
        let httpCustom = notif.httpCustom
        if(httpCustom.payload) {

          var payload = JSON.parse(decodeURI(httpCustom.payload))
          var msg = payload.text? payload.text : 'N/A'
          var phone = payload.dst? payload.dst : 'N/A'

          listItems.push(<ListItem primaryText={"Message: " + msg}/>)
          listItems.push(<ListItem primaryText={"Phone: " + phone}/>)
        }
      }
      details =
            <CardText>
              <List>
                  {listItems}
              </List>
            </CardText>
    } else {
      details = "No data yet";
    }

    return (
      <div className="sensor">
        <h1 className="page-title">Notification: {this.state.id}</h1>
        <Container fluid={true}>
          <Card>
            <CardTitle title="Notification" />
            {details}
          </Card>
        </Container>
      </div>
    );
  }
}

export default notifDetail;
