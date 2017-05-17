import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchHistoricalData } from '../actions/historicalDataActions'
import {Table, Alert, Panel, Well, ListGroupItem, ListGroup, ButtonToolbar, ButtonGroup, Button, Glyphicon} from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

  
class Visualizations extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    const  {deviceId, sensorIds, sp} = this.props.router.location.state
    dispatch(fetchHistoricalData( deviceId, sensorIds, sp))
  }

  render() {
    const  { deviceId, sensorIds} = this.props.router.location.state
    console.log(JSON.stringify(deviceId))
    const historicalData = this.props.historicalData.deviceId
    let graphics = []
    console.log(JSON.stringify(historicalData))
    //let graphics = historicalData.map( (sensorData) => {
    for (var sensorId in historicalData) { 
      //let unitMetric = this.props.sensingDevice.deviceId.sensorData[sensorData.key]["metadata"]["unit"]
      //const unit = ? : "";
      const unit = "a"
      //let sensorId = Object.keys(sensorData)
      const YAxisLabel = sensorId + '(' + unit + ')';
      let sensorData = historicalData.sensorId
      var visComp = [<Panel> Historical data is not available for {YAxisLabel}. </Panel>]
      if (sensorData.length > 0) {
        //console.log("There are some data for " + measurementId + " " + JSON.stringify(this.state.historicalData[measurementId]));
        var title = 'Historical data graph for ' + sensorId;
        visComp = [<Panel defaultExpanded header={title} >
          <LineChart width={1400} height={800} data={sensorData} margin={{ top: 40, right: 40, bottom: 25, left: 50 }}>
            <Line type="monotone" fill="#8884d8" dataKey="value" stroke="#8884d8" dot={{ stroke: 'red', strokeWidth: 5 }} activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }} name={sensorId} />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="time" padding={{ left: 30, right: 20 }} label="Time" name="Date" />
            <YAxis dataKey="value" padding={{ left: 20, right: 20, bottom: 40}} label={YAxisLabel} name={sensorId} />
            <Tooltip />
            (sensorId === 'SM1' || sensorId === 'SM2')? <ReferenceLine y={200} label="WET" padding={{ left: 10, right: 10 }} stroke="blue"/>
              <ReferenceLine y={1000} label="DRY" padding={{ left: 10, right: 10 }} stroke="red"/>
              : ;
          </LineChart>
        </Panel>]
      }
      graphics = graphics.concat(visComp);
    }
    
    return (<div>  { graphics}   </div>)
  }
}

const mapStateToProps = state => {
  return { historicalData: state.historicalData, sensingDevice: state.sensingDevice }
}

export const VisualizationsWrapperComponent = withRouter(connect(mapStateToProps)(Visualizations))
