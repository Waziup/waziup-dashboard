import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Table, Alert, Panel, Well, ListGroupItem, ListGroup, ButtonToolbar, ButtonGroup, Button, Glyphicon} from 'react-bootstrap';
import { fetchDevicesList } from '../actions/sensingDeviceActions'
import { Link } from 'react-router'

class SensingDevices extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchDevicesList())
  }

  filterSensorsSensingDevice(device) {
    const attributesToExclude = ["id", "type", "location", "dateCreated", "dateModified", "owner", "servicePath"];
    let sensors = [];
    let sensorIds = []
    for (var i in device) {
      if (attributesToExclude.indexOf(i) === -1 && device[i]) {
        let unit
        (device[i].metadata.unit === undefined) ?  unit = '':
        unit = "(" + device[i]['metadata']['unit'].value +")"

        sensors.push(i + unit + ': ' + device[i].value)
        sensorIds.push(i)
      }
        //sensors.push({ "sensor": i, "value": device[i].value })  + '(' +  + ')'
    }

    //console.log("sensorIds in filter:", sensorIds)
    return {sensors, sensorIds}
  }

  tableSensingDeivces(listDevices) {
    //console.log(listDevices)
    let index = 1
    let tableRows = listDevices.map((device) => {
      let {sensors, sensorIds} = this.filterSensorsSensingDevice(device)
      //console.log("sensorIds in table:", sensorIds)
      let latestSensorsValues = sensors.map(
        (sensor) => {return <ListGroupItem key={sensor} bsStyle="info"> {sensor} </ListGroupItem>})
      
      return (<tr key={device.id}>
        <td> {index++} </td>
        <td> {device.id} </td>
        <td> {device.dateCreated.value} </td> 
        <td> <Well>{device.dateModified.value}</Well> </td>
        <td> <Well><ListGroup >{latestSensorsValues}</ListGroup></Well> </td>
        <td> 
          <ButtonToolbar>
            <ButtonGroup block vertical>
              <Button><Glyphicon glyph="eye-open" />
              <Link activeClassName="active" to={{pathname: "/visualizations", state: { deviceId:device.id, sensorIds: sensorIds, sp: device.servicePath.value }}}> Visualizations</Link>
              </Button>
              <Button><Glyphicon glyph="pencil" /></Button>
              <Button><Glyphicon glyph="remove-circle" /></Button>
            </ButtonGroup>
          </ButtonToolbar> 
        </td>
      </tr>);
    })

    return tableRows
  }

  render() {
    const sensingDevice = this.props.sensingDevice
    const isFetching = sensingDevice.isFetching
    const fetched = sensingDevice.fetched

    //<PageHeader>Summary of Sensing Devices Information <small> </small></PageHeader>
    return (
      <div>
        <Panel collapsible defaultExpanded header="List of Sensing Devices">
          {(isFetching === true) ? (<Well> Sensing devices are being loaded. </Well> ):
            ((fetched === true) ?<Table responsive fill>
              <thead>
                <tr><th>#</th><th>DeviceID</th><th>dateCreated</th>
                <th>dateModified</th><th>Latest Sensors Data</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {this.tableSensingDeivces(sensingDevice.listDevices)}
              </tbody>
            </Table>: 
            (<Alert bsStyle="warning">
              <strong>Error</strong> happened during fetching sensing devices: {sensingDevice.errMsg}.
            </Alert> ))
          }
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { sensingDevice: state.sensingDevice }
}

export default connect(mapStateToProps)(SensingDevices)