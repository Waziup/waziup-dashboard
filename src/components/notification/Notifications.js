import React, { Component } from 'react';
import { Container} from 'react-grid-system'
import FullWidthSection from '../FullWidthSection'
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody,TableHeader, TableHeaderColumn, TableRow}  from 'material-ui/Table';
import {Card, CardActions, CardTitle} from 'material-ui/Card';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import SubmitForm from './SubmitNotificationFormContainer.js' ;
import {loadSensors, subscribeHistoData, getNotifications} from "../../index.js";
import Griddle, {plugins, RowDefinition, ColumnDefinition, enhancedWithRowData} from 'griddle-react';
import RowActions from './RowActions.js';
import { connect } from 'react-redux';

export default class NotificationForm extends Component {
  // Constructor for the component
  constructor(props) {
      super(props);
      this.state = {
          modalOpen : false,
          notifications: []
      };

      this.handleSubmit                   = this.handleSubmit.bind(this);
      this.handleOpen                     = this.handleOpen.bind(this);
      this.handleClose                    = this.handleClose.bind(this);
      getNotifications();
  }


  componentWillReceiveProps(nextProps){

    console.log("props:" + JSON.stringify(nextProps))
    if (nextProps.notifications) {
       this.setState({notifications: nextProps.notifications})
    }
  }
  //Fire when submitting the form data
  handleSubmit(event) {
    console.log("submit:" + JSON.stringify(event))
    subscribeHistoData("WS_UPPA_Sensor2", [])
      
  }
  
  //Fire the modal window when click on the button
  handleOpen(event){
      this.setState({modalOpen : true})
  }
  
  handleClose(event){
      this.setState({modalOpen : false})
  }
  
  handleNotifDelete = (data) => {
  }

  handleNotifUpdate = (data) => {
  }

  render() {
  
  const actions = [
      <RaisedButton label="Cancel" primary={true} onTouchTap={this.handleClose}/>,
      <RaisedButton label="Submit" primary={true} disabled={true} onTouchTap={this.handleClose}/>,
  ];
  
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
  
  return (
     <div>
           <h1 className="page-title">Notifications settings</h1>
               <Container>
                   <FullWidthSection useContent={true} >      
                       <Card>                        
                         <Griddle resultsPerPage={50} data={this.state.notifications} plugins={[plugins.LocalPlugin]} showFilter={true} >
                            <RowDefinition>
                              <ColumnDefinition id="id" title="ID"/>
                              <ColumnDefinition id="description" title="Description"/>
                              <ColumnDefinition id="subject.entities.id" title="Subject"/>
                              <ColumnDefinition id="actions" title="Actions" customComponent={enhancedWithRowData(RowActions)}/> 
                            </RowDefinition>
                         </Griddle>
                         <CardActions>                           
                           <RaisedButton label="Add" onTouchTap={this.handleOpen} primary={true}  />
                         </CardActions>
                         </Card>                            
                        <SubmitForm  modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.handleSubmit} /> 
                   </FullWidthSection>
               </Container>
        </div>
     );
  }
}

