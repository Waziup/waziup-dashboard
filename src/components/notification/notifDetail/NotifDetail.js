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
      var notif = nextProps.sensors.find((el) => {
        return el.id === this.props.params.notifId;
      });
      this.setState({ notif: notif });
    }
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="sensor">
        <h1 className="page-title">Notification: {this.state.id}</h1>
        <Container fluid={true}>
          <Card>
            <CardTitle title="Notification" />
            <CardText>
              <List>
                <ListItem primaryText={"ID: " + this.state.notif.id} />
              </List>
            </CardText>
          </Card>
        </Container>
      </div>
    );
  }
}

export default notifDetail;
