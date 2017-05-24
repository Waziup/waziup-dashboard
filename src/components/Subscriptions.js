import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Table, Alert, Panel, Well, ListGroupItem, ListGroup} from 'react-bootstrap';
import moment from 'moment-timezone';
import OrionParamForm from './OrionParamForm';
import { fetchSubscriptionsList } from '../actions/subscriptionActions'
import SubscriptionDetails from './SubscriptionDetails'

//PageHeader, 
//, FormGroup, Form, ControlLabel, FormControl, Button

class Subscriptions extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    const s = this.props.security.userInfo.idTokenParsed.Service
    const sp = this.props.security.userInfo.idTokenParsed.ServicePath + '#' //check if / missing add an /
    dispatch(fetchSubscriptionsList(s, sp))
  }

  listNotification(notification) {
    //{"timesSent":4,"lastNotification":"2017-05-11T04:43:06.00Z","attrs":["SM1","SM2"],
    //"attrsFormat":"legacy","http":{"url":"http://cygnus:5050/notify"},
    //"lastSuccess":"2017-05-11T04:43:06.00Z"}
    let sensorsList = notification.attrs.map((sensor) => (sensor))
    //<ListGroupItem key= bsStyle="info"> </ListGroupItem> 
    //"warning" , "danger", "default"
    return <ListGroup id='notification'>
      <ListGroupItem key='lastNotification' bsStyle="info"> Last Notification: {moment(notification.lastNotification).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z')} </ListGroupItem>
      <ListGroupItem key='lastSuccess' bsStyle='success'> Last Successful Notification: {moment(notification.lastSuccess).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z')} </ListGroupItem>
      <ListGroupItem key='url' bsStyle="info"> Notification Endpoint: {notification.http? notification.http.url: 'NO'}</ListGroupItem>
      <ListGroupItem key='timesSent' bsStyle="warning"> Notification Numbers: {notification.timesSent} </ListGroupItem>
      <ListGroupItem key='sensors' bsStyle="info"> {sensorsList} </ListGroupItem>
      </ListGroup>
  }

  listSubscriptionsEntities(subject) {
    //"entities":[{"id":"WS_FARM1_Sensor3","type":"SensingDevice"}]
    let sensingDevicesList = subject.entities.filter((entry) => (entry.type === 'SensingDevice')).map((sensingDevice) =>
      (<ListGroupItem key={sensingDevice.id} bsStyle="info"> {sensingDevice.id} </ListGroupItem>))
    
    //,"condition":{"attrs":["SM1","SM2"]}
    let sensorsList = subject.condition.attrs.map((sensor) => (<ListGroupItem key={sensor} bsStyle="info"> {sensor} </ListGroupItem>))
    
    return <Well><ListGroup id='sensingDevices'>{sensingDevicesList}</ListGroup>
            <ListGroup id='sensors'>{sensorsList}</ListGroup></Well>
  }

  tableSubscriptions(listSubscriptions) {
    //console.log(listSubscriptions)
  // {"timesSent":4,"lastNotification":"2017-05-11T04:43:06.00Z","attrs":["SM1","SM2"],"attrsFormat":"legacy","http":{"url":"http://cygnus:5050/notify"},"lastSuccess":"2017-05-11T04:43:06.00Z"}
  //   <td> <Well><ListGroup >{latestSensorsValues}</ListGroup></Well> </td>

    //return JSON.stringify(listSubscriptions)
    let index = 1
    let tableRows = listSubscriptions.map((subs) => {
      //let latestSensorsValues = this.filterSensorsSensingDevice(subs).map(
        //(sensor) => {return <ListGroupItem key={sensor} bsStyle="info"> {sensor} </ListGroupItem>})
      //console.log(latestSensorsValues) 
      return (<tr key={subs.id}>
        <td> {index++} </td>
        <td> {subs.id} <SubscriptionDetails subs={subs}/> </td>
        <td > {moment(subs.expires).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z')} </td>
        <td> {subs.status} </td>
        <td> {subs.throttling} </td>
        <td> {this.listSubscriptionsEntities(subs.subject)} </td>
        <td> {this.listNotification(subs.notification)} </td>
      </tr>);
    })

    return tableRows
  }
  
  render() {
    const subscriptions = this.props.subscriptions
    const isFetching = subscriptions.isFetching
    const fetched = subscriptions.fetched

    //<PageHeader>Summary of Sensing Devices Information <small> </small></PageHeader>
    return (
      <div>
        <OrionParamForm action={fetchSubscriptionsList} actionName='Subscriptions' orionService={this.props.security.userInfo.idTokenParsed.Service} orionServicePath={this.props.security.userInfo.idTokenParsed.ServicePath}/>     
          {(isFetching === true) ? (<Well> Subscriptions are being loaded. </Well> ):
            ((fetched === true) ?
             (subscriptions.subscriptionsList.length === 0 ? 
             (<Well> There are no subscriptions for the selected service and servicePath. </Well> )
             : 
             (<Panel collapsible defaultExpanded header={<h3>List of Subscriptions (<b>{subscriptions.subscriptionsList.length}</b>) </h3>} >
             <Table responsive fill>
              <thead>
                <tr>
                <th>#</th>
                <th>SubscriptionID</th>
                <th>Expiry Time</th>
                <th>Status</th>
                <th>Throttling</th>
                <th>Subject</th>
                <th>Notifications</th>
                </tr>
              </thead>
              <tbody>
                {this.tableSubscriptions(subscriptions.subscriptionsList)}
              </tbody>
             </Table></Panel>)
            ):
            (<Alert bsStyle="warning">
              <strong>Error</strong> happened during fetching Subscriptions: {subscriptions.errMsg}.
            </Alert>)
            )
          }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {subscriptions: state.subscriptions,
          security: state.security}
}

export default connect(mapStateToProps)(Subscriptions)