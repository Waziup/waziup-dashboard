import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Table, Alert, PageHeader, Panel, Well, ListGroupItem, ListGroup} from 'react-bootstrap';
import { fetchSubscriptionsList } from '../actions/sensingDeviceActions'

class Subscriptions extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchSubscriptionsList())
  }

  filterSensorsSensingDevice(device) {
    const attributesToExclude = ["id", "type", "location", "dateCreated", "dateModified", "owner", "servicePath"];
    let sensors = [];
    for (var i in device) {
      if (attributesToExclude.indexOf(i) === -1 && device[i]) {
        let unit
        (device[i].metadata.unit === undefined) ?  unit = '':
        unit = "(" + device[i]['metadata']['unit'].value +")"

        sensors.push(i + unit + ': ' + device[i].value)
      }
        //sensors.push({ "sensor": i, "value": device[i].value })  + '(' +  + ')'
    }
    return sensors
  }

  tableSubscriptions(listSubscriptions) {
    console.log(listSubscriptions)
    return JSON.stringify(listSubscriptions)
    /*let index = 1
    let tableRows = listDevices.map((device) => {
      let latestSensorsValues = this.filterSensorsSensingDevice(device).map(
        (sensor) => {return <ListGroupItem key={sensor} bsStyle="info"> {sensor} </ListGroupItem>})
      //console.log(latestSensorsValues)
      return (<tr key={device.id}>
        <td> {index++} </td>
        <td> {device.id} </td>
        <td> {device.dateCreated.value} </td> 
        <td> <Well>{device.dateModified.value}</Well> </td>
        <td> <Well><ListGroup >{latestSensorsValues}</ListGroup></Well> </td>
      </tr>);
    })

    return tableRows*/
  }

  render() {
    const subscriptions = this.props.subscriptions
    const isFetching = subscriptions.isFetching
    const fetched = subscriptions.fetched

    //<PageHeader>Summary of Sensing Devices Information <small> </small></PageHeader>
    return (
      <div>
        <Panel collapsible defaultExpanded header="List of Subscriptions">
          {(isFetching === true) ? (<Well> Subscriptions are being loaded. </Well> ):
            ((fetched === true) ? <Table responsive fill>
              <thead>
                <tr><th>#</th><th>SubscriptionID</th><th>dateCreated</th>
                <th>dateModified</th><th>Latest Sensors Data</th></tr>
              </thead>
              <tbody>
                {this.tableSubscriptions(subscriptions.subscriptionsList)}
              </tbody>
            </Table>: 
            (<Alert bsStyle="warning">
              <strong>Error</strong> happened during fetching Subscriptions: {subscriptions.errMsg}.
            </Alert> ))
          }
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {subscriptions: state.subscriptions}
}

export default connect(mapStateToProps)(Subscriptions)