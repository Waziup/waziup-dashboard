import React, { Component } from 'react';
import { Container} from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions } from 'material-ui/Card';
import NewNotifForm from './notifForm/NotifFormContainer.js' ;
import {loadSensors, createSubscription, getNotifications, deleteNotif} from "../../index.js";
import Griddle, {plugins, RowDefinition, ColumnDefinition} from 'griddle-react';
import NotifActions from './NotifActions.js';
import { connect } from 'react-redux';
import Utils from '../../lib/utils';

export default class Notifications extends Component {
  // Constructor for the component
  constructor(props) {
      super(props);
      this.state = {
          modalOpen : false,
          notifications: [],
          sensors: []
      };

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleOpen   = this.handleOpen.bind(this);
      this.handleClose  = this.handleClose.bind(this);
      getNotifications();
      loadSensors(true);
  }

  componentWillReceiveProps(nextProps){

    console.log("props:" + JSON.stringify(nextProps))
    if (nextProps.notifications) {
       this.setState({notifications: nextProps.notifications})
    }
    if (nextProps.sensors) {
       this.setState({sensors: nextProps.sensors})
    }
  }
  //Fire when submitting the form data
  handleSubmit(event) {
    console.log("submit:" + JSON.stringify(event))
    createSubscription(event.desc,
                       event.sensors,
                       event.attrs,
                       event.expr,
                       event.url,
                       event.headers,
                       event.payload,
                       event.expires,
                       event.throttling)
    getNotifications();
  }

  //Fire the modal window when click on the button
  handleOpen(event){
      this.setState({modalOpen : true})
  }

  handleClose(event){
      this.setState({modalOpen : false})
  }

  handleNotifDelete = (data) => {
    deleteNotif(data);
    getNotifications();
  }

  handleNotifUpdate = (data) => {
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
        updateAction: this.handleNotifUpdate
      };
    });

    function NotificationComponent({value, griddleKey}) {
       var url = null
       if (value.get("http"))
          url = value.get("http").get("url")
       if (value.get("httpCustom"))
          url = value.get("httpCustom").get("url")

       return (
        <div className="NotificationComponent">
          {url}
        </div>
      );
    }

    function SubjectComponent({value, griddleKey}) {
       var ids = ""
       console.log("Sub" + value)
       for(var ent of value.get("entities")) {
          console.log("Sub2" + typeof(ent))
          if(ent.get("id"))
             ids = ids + ent.get("id") + "\n"
          if(ent.get("idPattern"))
             ids = ids + ent.get("idPattern") + "\n"
       }

       return (
        <div className="SubjectComponent">
          {ids}
        </div>
      );
    }

    return (
       <div>
          <h1 className="page-title">Notifications settings</h1>
          <Container>
              <div>
                  <Card>
                    <Griddle resultsPerPage={50} data={this.state.notifications} plugins={[plugins.LocalPlugin]} showFilter={true} styleConfig={Utils.styleConfig()}>
                       <RowDefinition>
                         <ColumnDefinition id="id" title="ID"/>
                         <ColumnDefinition id="description" title="Description"/>
                         <ColumnDefinition id="subject" title="Subject" customComponent={SubjectComponent}/>
                         <ColumnDefinition id="notification" title="URL" customComponent={NotificationComponent}/>
                         <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(NotifActions)}/> 
                         <ColumnDefinition id="status" title="Status"/>
                       </RowDefinition>
                    </Griddle>
                    <CardActions>
                      <RaisedButton label="Add" onTouchTap={this.handleOpen} primary={true}  />
                    </CardActions>
                  </Card>                            
                  <NewNotifForm sensors={this.state.sensors} modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.handleSubmit} /> 
              </div>
          </Container>
       </div>
    );
  }
}

