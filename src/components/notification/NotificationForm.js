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
import {loadSensors, subscribeHistoData} from "../../index.js"

export default class NotificationForm extends Component {
    // Constructor for the component
    constructor(props) {
        super(props);
        this.state = {
            modalOpen : false ,
        };

        this.handleSubmit                   = this.handleSubmit.bind(this);
        this.handleOpen                     = this.handleOpen.bind(this);
        this.handleClose                    = this.handleClose.bind(this);
        loadSensors(true);
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

