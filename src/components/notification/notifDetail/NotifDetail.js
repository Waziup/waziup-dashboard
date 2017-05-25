import axios from 'axios'
import React, { Component } from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container, Col, Visible, Hidden } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import UTIL from '../../../utils.js';
import { getNotifications } from "../../../index.js"
import moment from 'moment-timezone';

var position = [12.238, -1.561];
class notifDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notif: {},
    };
    
    getNotifications();
  }

  componentWillReceiveProps(nextProps) {

    console.log("nextProps.notifications:" + JSON.stringify(nextProps.notifications));
    if (nextProps.notifications && this.props.params.notifId) {
      var notif = nextProps.notifications.find((el) => {
        return el.id === this.props.params.notifId;
      });
      this.setState({ notif: notif });
      console.log("notif: " + JSON.stringify(notif));
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  render() {
    let details = null;
    let notif = this.state.notif;
    var listItems = [];
    if (this.state.notif.id) {

      listItems.push(<ListItem primaryText={"ID: " + notif.id} />)
      if (notif.description)
         listItems.push(<ListItem primaryText={"Description: " + notif.description}/>)
      listItems.push(<ListItem primaryText={"Entities: " + notif.subject.entities.map((e) => e.id).join(", ")}/>)
      if(notif.subject.condition) {
        if(notif.subject.condition.attrs) 
           listItems.push(<ListItem primaryText={"Condition attributes: " + notif.subject.condition.attrs.join(", ")}/>)
        if(notif.subject.condition.expression) {
          if(notif.subject.condition.expression.q) 
            listItems.push(<ListItem primaryText={"Condition expression: " + notif.subject.condition.expression.q}/>)
        }
      }
      if(notif.notification.timesSent)
        listItems.push(<ListItem primaryText={"Times sent: " + notif.notification.timesSent}/>)
      if(notif.notification.lastNotification)
        listItems.push(<ListItem primaryText={"Last notification: " + notif.notification.lastNotification}/>)
      if(notif.notification.http)
        listItems.push(<ListItem primaryText={"Notified URL: " + notif.notification.http.url}/>)
      if(notif.notification.httpCustom) {
        listItems.push(<ListItem primaryText={"Notified URL: " + notif.notification.httpCustom.url}/>)
 
        if(notif.notification.httpCustom.headers)
          listItems.push(<ListItem primaryText={"HTTP headers: " + notif.notification.httpCustom.headers.map()}/>)
        if(notif.notification.httpCustom.qs)
          listItems.push(<ListItem primaryText={"HTTP query string: " + notif.notification.httpCustom.qs}/>)
        if(notif.notification.httpCustom.method)
          listItems.push(<ListItem primaryText={"HTTP method: " + notif.notification.httpCustom.method}/>)
        if(notif.notification.httpCustom.payload)
          listItems.push(<ListItem primaryText={"Notification payload: " + notif.notification.httpCustom.payload}/>)
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
