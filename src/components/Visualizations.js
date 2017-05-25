import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchHistoricalData } from '../actions/historicalDataActions'
import { Panel, PageHeader} from 'react-bootstrap';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import moment from 'moment-timezone';

class CustomTick extends Component {
    render() { 
        // 'Europe/Berlin'moment.tz.guess()
        //.tz('PKT') does not exist
        //By default, moment objects are created in the local time zone. To change the default time zone, use moment.tz.setDefault with a valid time zone.
        const time = new moment(this.props.payload.value).tz(moment.tz.guess());
        const props = this.props;
        //15th May, 2017 moment().format('MMMM Do YYYY
        //time.format('D.M.YYYY')

        return (
            <g>
            <text width={props.width} height={props.height} x={props.x} y={props.y} stroke={props.stroke} fill={props.fill} textAnchor={props.textAnchor} className="recharts-text recharts-cartesian-axis-tick-value">
                    <tspan dy="1em">{time.format('H:mm a z')}</tspan>
            </text>
              <text width={props.width} height={props.height} x={props.x} y={props.y} stroke={props.stroke} fill={props.fill} textAnchor={props.textAnchor} className="recharts-text recharts-cartesian-axis-tick-value">
                <tspan dy="2em">{time.format('MMMM Do YYYY')}</tspan>
            </text>
            </g>
        );
    }
}

class Visualizations extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    const  {deviceId, sensorIds, sp} = this.props.router.location.state
    dispatch(fetchHistoricalData(deviceId, sensorIds, sp))
  }

  render() {
    function xFormatter(tick) {
      return new moment(tick).tz(moment.tz.guess()).format('H:mm a z');
    }

    function yFormatter(tick) {
      return Math.round(tick);
    }
    const  {deviceId} = this.props.router.location.state
    const historicalData = this.props.historicalData[deviceId]
    let graphics = [ <PageHeader> Visualizations for Sensing Device {deviceId} per Sensors </PageHeader>]
    //let graphics = historicalData.map( (sensorData) => {
    for (var sensorId in historicalData) { 
      let unitMetric = '';
      //if(this.props.sensingDevice.deviceId.sensorID.metadata.unit != undefined)
       // unitMetric = this.props.sensingDevice.deviceId.sensorID.metadata.unit.value
      //let sensorId = Object.keys(sensorData)
      let fetched = historicalData[sensorId].fetched
      let isFetching = historicalData[sensorId].isFetching
      const YAxisLabel = (unitMetric === '')?sensorId:sensorId + '(' +  + ')';
      var visComp = [<Panel key={sensorId}> Historical data is not available for {YAxisLabel}. </Panel>]
    
      if (fetched === true ) {
        let sensorData = historicalData[sensorId].data
        if(sensorData.length > 0) {
          //let sensorDataNormalized = sensorData.map((data) => ({'time': data.time, 'value': Math.ceil(125 - 0.125* parseFloat(data.value))}))
          let ticks = sensorData.map(entry => entry.time);
          var title = 'Historical data graph for ' + sensorId;
          // <Line  name={sensorId}  activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }} isAnimationActive={false} connectNulls={true} />
          visComp = [<Panel key={sensorId} defaultExpanded header={title} >
            <ResponsiveContainer width="100%" height={500}>
            <LineChart data={sensorData} margin={{ top: 40, right: 40, bottom: 25, left: 50 }}>
              <XAxis dataKey='time' domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={ticks} tick={<CustomTick/>} />
              <YAxis dataKey="value" domain={[0, 'dataMax']} label={YAxisLabel} tickFormatter={yFormatter} />
              <Line dataKey="value" name={sensorId} type="monotone" fill="#8884d8" stroke="#8884d8" dot={{ stroke: 'blue', strokeWidth: 5 }} isAnimationActive={true} connectNulls={true} />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
            </LineChart></ResponsiveContainer></Panel>
          ]
        }
      } else if (isFetching === true) {
          visComp = [<Panel key={sensorId}> Historical data are being loaded for {YAxisLabel}. </Panel>]
      }
      graphics = graphics.concat(visComp);
    }
    return (<div>{graphics}</div>)
  }
}

const mapStateToProps = state => {
  return { historicalData: state.historicalData, 
    sensingDevice: state.sensingDevice }
}

export const VisualizationsWrapperComponent = withRouter(connect(mapStateToProps)(Visualizations))