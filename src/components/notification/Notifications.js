import React, { Component } from 'react';
import { Container } from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';
import { Card, CardActions } from 'material-ui/Card';
import NotifForm from './notifForm/NotifFormContainer.js';
import Griddle, { plugins, RowDefinition, ColumnDefinition } from 'griddle-react';
import NotifActions from './NotifActions.js';
import { connect } from 'react-redux';
import Utils from '../../lib/utils';

export default class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount() {
    this.props.loadSensors(true, this.props.user);
    this.props.loadNotifs(this.props.user);
  }

  componentWillReceiveProps(nextProps) {

    //console.log("props:" + JSON.stringify(nextProps))
    if (nextProps.notifications) {
      this.setState({ notifications: nextProps.notifications })
    }
    if (nextProps.sensors) {
      this.setState({ sensors: nextProps.sensors })
    }
  }

  //Fire when submitting the form data
  handleSubmit(event) {
    //console.log("submit:" + JSON.stringify(event))
    this.props.createNotif(event.desc,
      event.sensors,
      event.attrs,
      event.expr,
      event.phone,
      event.message,
      event.expires,
      event.throttling,
      this.props.user);
    this.props.loadNotifs(this.props.user);
  }

  //Fire the modal window when click on the button
  handleOpen(event) {
    this.setState({ modalOpen: true })
  }

  handleClose(event) {
    this.setState({ modalOpen: false })
  }

  handleNotifDelete = (notif) => {
    this.props.deleteNotif(notif.id, this.props.user);
    this.props.loadNotifs(this.props.user);
  }

  render() {

    const rowDataSelector = (state, { griddleKey }) => {
      return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .toJSON();
    };

    const enhancedWithRowData = connect((state, props) => {
      return {
        // rowData will be available into RowActions
        rowData: rowDataSelector(state, props),
        deleteAction: this.handleNotifDelete,
      };
    });

    function PhoneComponent(row) {
      var notif = row.rowData.notification
      //console.log("subscription: " + JSON.stringify(row.rowData))
      var phone = 'N/A'
      if (notif.httpCustom) {
        try {
          var payload = JSON.parse(decodeURI(notif.httpCustom.payload))
          phone = payload.dst ? payload.dst : 'N/A'
        } catch (e) {
          console.log('payload', notif.httpCustom.payload);
        }

      }
      return (
        <div className="PhoneComponent">
          {phone}
        </div>
      );
    }

    function MsgComponent(row) {
      var notif = row.rowData.notification
      var msg = 'N/A'
      if (notif.httpCustom) {
        try {
          var payload = JSON.parse(decodeURI(notif.httpCustom.payload))
          var msg = payload.text ? payload.text : 'N/A'
        } catch (e) {
          console.log('payload', notif.httpCustom.payload);
        }
      }
      return (
        <div className="MsgComponent">
          {msg}
        </div>
      );
    }

    function SubjectComponent({ value, griddleKey }) {
      var ids = ""
      //console.log("Sub" + value)
      for (var ent of value.get("entities")) {
        console.log("Sub2" + typeof (ent))
        if (ent.get("id"))
          ids = ids + ent.get("id") + "\n"
        if (ent.get("idPattern"))
          ids = ids + ent.get("idPattern") + "\n"
      }

      return (
        <div className="SubjectComponent">
          {ids}
        </div>
      );
    }

    //filtering notifications that have httpCustom (to include only Plivo notifications)
    //TODO: generalize
    let data = this.props.notifications.filter(n => n.notification.httpCustom)

    return (
      <div>
        <h1 className="page-title">Notifications settings</h1>
        <Container>
          <div>
            <Card>
              <Griddle resultsPerPage={50} data={data} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()}>
                <RowDefinition>
                  <ColumnDefinition id="description" title="Description" />
                  <ColumnDefinition id="phone" title="Phone" customComponent={enhancedWithRowData(PhoneComponent)} />
                  <ColumnDefinition id="msg" title="Msg" customComponent={enhancedWithRowData(MsgComponent)} />
                  <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(NotifActions)} />
                  <ColumnDefinition id="status" title="Status" />
                </RowDefinition>
              </Griddle>
              <CardActions>
                <RaisedButton label="Add" onTouchTap={this.handleOpen} primary={true} />
              </CardActions>
            </Card>
            <NotifForm sensors={this.props.sensors} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.handleSubmit} />
          </div>
        </Container>
      </div>
    );
  }
}

