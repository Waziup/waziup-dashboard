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
import {loadSensors, subscribeHistoData, getNotifications} from "../../index.js"
import Griddle, {plugins, RowDefinition, ColumnDefinition} from 'griddle-react';

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

tableMeta = [
  {
    "columnName": "id",
    "order": 1,
    "displayName": "ID"
  },
  {
    "columnName": "description",
    "order": 2,
    "visible": true,
    "displayName": "Description"
  },
  {
    "columnName": "subject",
    "order": 2,
    "visible": true,
    "displayName": "Subject"
  },
 // {
 //   "columnName": "entities",
 //   "order": 3,
 //   "visible": true,
 //   "displayName": "Entities",
 //   "customComponent": NotificationEntities
 // },
 // {
 //   "columnName": "conditions",
 //   "order": 4,
 //   "visible": true,
 //   "displayName": "Conditions",
 //   "customComponent": NotificationConditions
 // },
 // {
 //   "columnName": "notification",
 //   "order": 5,
 //   "visible": true,
 //   "displayName": "Notification",
 //   "customComponent": NotificationDetails
 // },

];

render() {

const actions = [
    <RaisedButton label="Cancel" primary={true} onTouchTap={this.handleClose}/>,
    <RaisedButton label="Submit" primary={true} disabled={true} onTouchTap={this.handleClose}/>,
];

return(
    	<div>
            <h1 className="page-title">Notifications settings</h1>
                <Container>
                    <FullWidthSection useContent={true} >      
                        <Griddle resultsPerPage={50} data={this.state.notifications} plugins={[plugins.LocalPlugin]} showFilter={true} >
                           <RowDefinition>
                              <ColumnDefinition id="id" title="ID"/>
                              <ColumnDefinition id="description" title="Description"/>
                              <ColumnDefinition id="subject" title="Subject"/>
                           </RowDefinition>

                        </Griddle>
                        <Card>                        
                          <Table fixedHeader={true} fixedFooter={true} selectable={true} multiSelectable={true} heigth='300px'>
                            <TableHeader displaySelectAll={true} adjustForCheckbox={true} enableSelectAll={true}>                                 
                                 <TableRow>
                                    <TableHeaderColumn tooltip="The id of notification">ID</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The username">Username</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="Channel">Channel</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The user profile">Profile</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The sensor">Sensor</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The data from sensor">Data type</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="The user profile">Threshold</TableHeaderColumn>
                                    <TableHeaderColumn tooltip="Actions">Actions</TableHeaderColumn>
                                 </TableRow>
                            </TableHeader>
                            <TableBody>

                            </TableBody>
                           
                          </Table>
                          <CardActions>                           
                            <RaisedButton label="Add" onTouchTap={this.handleOpen} primary={true}  />
                            <RaisedButton label="Edit"  primary={true}/>
                            <RaisedButton label="Delete" primary={true}/>
                          </CardActions>
                          </Card>                            
                         <SubmitForm  modalOpen={this.state.modalOpen} handleClose={this.handleClose} onSubmit={this.handleSubmit} /> 
                    </FullWidthSection>
                </Container>
           </div>
        );
    }
}

