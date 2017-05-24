import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Table, Alert, Panel, Well, ListGroupItem, ListGroup, ButtonToolbar, ButtonGroup, Button, Glyphicon} from 'react-bootstrap';
import moment from 'moment-timezone';
import { fetchDevicesList } from '../actions/sensingDeviceActions'
import { Link } from 'react-router'
import OrionParamForm from './OrionParamForm';
import SensingDeivceDetails from './SensingDeivceDetails'


class SensingDevices extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    const s = this.props.security.userInfo.idTokenParsed.Service
    const sp = this.props.security.userInfo.idTokenParsed.ServicePath + '#' //check if / missing add an /
    dispatch(fetchDevicesList(s, sp))
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
    let readableDate = (d) => (moment(d).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z'))
    let index = 1
    let tableRows = listDevices.map((device) => {
      let {sensors, sensorIds} = this.filterSensorsSensingDevice(device)
      //console.log("sensorIds in table:", sensorIds)
      let latestSensorsValues = sensors.map(
        (sensor) => {return <ListGroupItem key={sensor} bsStyle="info"> {sensor} </ListGroupItem>})
      
      return (<tr key={device.id}>
        <td> {index++} </td>
        <td> <Well>{device.id}</Well> <SensingDeivceDetails device={device}/></td>
        <td> <Well>{readableDate(device.dateCreated.value)}</Well> </td> 
        <td> <Well>{readableDate(device.dateModified.value)}</Well> </td>
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
    const listDevices= sensingDevice.listDevices

    //<PageHeader>Summary of Sensing Devices Information <small> </small></PageHeader>
    return (
      <div>
        <OrionParamForm action={fetchDevicesList} actionName='Sensing Devices' orionService={this.props.security.userInfo.idTokenParsed.Service} orionServicePath={this.props.security.userInfo.idTokenParsed.ServicePath}/>
        {(isFetching === true) ? (<Well> Sensing Devices are being loaded. </Well> ):
        ((fetched === true) ?
        (listDevices.length === 0 ?
        (<Well> There are no Sensing Devices for the selected service and servicePath. </Well> )
        :
        (<Panel collapsible defaultExpanded header={<h3>List of Sensing Devices (<b>{listDevices.length}</b>) </h3>} >
          <Table responsive fill>
              <thead>
                <tr>
                  <th>#</th>
                  <th>DeviceID</th>
                  <th>Creation Date</th>
                  <th>Last Updates</th>
                  <th>Latest Sensors Data</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.tableSensingDeivces(listDevices)}
              </tbody>
            </Table></Panel>)
            ): 
            (<Alert bsStyle="warning">
              <strong>Error</strong> happened during fetching sensing devices: <br/> {sensingDevice.errMsg}.
            </Alert> )
            )
          }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return { sensingDevice: state.sensingDevice,
          security: state.security}
}

export default connect(mapStateToProps)(SensingDevices)