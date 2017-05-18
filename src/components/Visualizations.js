import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchHistoricalData } from '../actions/historicalDataActions'
import { Panel, PageHeader} from 'react-bootstrap';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

  
class Visualizations extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    const  {deviceId, sensorIds, sp} = this.props.router.location.state
    dispatch(fetchHistoricalData( deviceId, sensorIds, sp))
  }

  render() {
    const  { deviceId, sensorIds} = this.props.router.location.state
    //console.log(JSON.stringify(deviceId))
    const historicalData = this.props.historicalData[deviceId]
    let graphics = [ <PageHeader> Visualizations for Sensing Device {deviceId} per sensors </PageHeader>]
    //console.log(JSON.stringify(historicalData))
    //let graphics = historicalData.map( (sensorData) => {
    for (var sensorId in historicalData) { 
      //let unitMetric = this.props.sensingDevice.deviceId.sensorData[sensorData.key]["metadata"]["unit"]
      //const unit = ? : "";
      const unit = "%"
      //let sensorId = Object.keys(sensorData)
      const YAxisLabel = 'Moisture' + '(' + unit + ')';
      let sensorData = historicalData[sensorId].data
      let fetched = historicalData[sensorId].fetched
      let isFetching = historicalData[sensorId].isFetching
      var visComp = [<Panel key={sensorId}> Historical data is not available for {YAxisLabel}. </Panel>]
      //console.log(JSON.stringify(sensorData))

      if (fetched === true ) {
        //console.log("There are some data for " + sensorId + " " + JSON.stringify(sensorData));
        if(sensorData.length > 0) {
          let sensorDataNormalized = sensorData.map((data) => {return {'time': data.time, 'value': Math.ceil(125 - 0.125* parseFloat(data.value))}})
          var title = 'Historical data graph for ' + sensorId;
          visComp = [<Panel key={sensorId} defaultExpanded header={title} >
            <LineChart width={1200} height={1000} data={sensorDataNormalized} margin={{ top: 40, right: 40, bottom: 25, left: 50 }}>
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
      } else if (isFetching === true) {
          visComp = [<Panel key={sensorId}> Historical data are being loaded {YAxisLabel}. </Panel>]
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