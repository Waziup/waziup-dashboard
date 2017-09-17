import React, {Component} from 'react';
import { CardText, CardTitle } from 'material-ui/Card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import UTIL from '../../../../utils'
import { getHisto } from "../../../../index.js"
import moment from 'moment-timezone';

class CustomTick extends Component {

    render() {
        const time = new moment(this.props.payload.value).tz(moment.tz.guess());
        const props = this.props;

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
class SensorChart extends Component {

  defaultProps = {
    sensor: {}
  };

  componentWillReceiveProps(nextProps){
    if(!UTIL.objIsEmpty(nextProps.sensor) && (nextProps.sensor !== this.props.sensor)){

      console.log(nextProps);
      getHisto(nextProps.sensor);
    }
  }

  render() {
    var visCompAll = [];

    function xFormatter(tick) {
      return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
    }

    function yFormatter(tick) {
      return Math.round(tick);
    }
    //<Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
    for (var measurementId in this.props.historical) {
      let unit = this.props.sensor[measurementId]["metadata"]["unit"]
      //unit = unit? unit["value"]: "";
      const YAxisLabel = unit? measurementId + '(' + unit["value"] + ')': measurementId ;
      var visComp = [<CardText> Historical data is not available for {YAxisLabel}. </CardText>]
      if (this.props.historical[measurementId].length > 0) {
        const ticks = this.props.historical[measurementId].map(entry => entry.time);
        var title = 'Historical data graph for ' + measurementId;
        visComp = [<CardTitle title={title} /> ]
        var visComp2 = [
        <ResponsiveContainer width="100%" height={500}>
          <LineChart  data={this.props.historical[measurementId]}
            margin={{ top: 40, right: 60, bottom: 40, left: 50 }}>

          <XAxis interval='preserveStart' dataKey="time" padding={{ left: 0, right: 20 }} label="Time"
           tickFormatter={xFormatter} ticks={ticks} tick={<CustomTick/>}  />

          <YAxis domain={[0, 1000]} dataKey="value" padding={{ left: 20, right: 20, bottom: 0}} label={YAxisLabel}
            name={measurementId} tickFormatter={yFormatter}/>

          <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />

          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />

          <Line name={measurementId} type="monotone" dataKey="value" fill="#8884d8"  stroke="#8884d8"
          strokeWidth={2}
          dot={{ stroke: 'red', strokeWidth: 5 }}
          activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }}  connectNulls={true}/>

          (measurementId === 'SM1' || measurementId === 'SM2')? <ReferenceLine y={200} label="WET" padding={{ left: 10, right: 10 }} stroke="blue"/>
              <ReferenceLine y={1000} label="DRY" padding={{ left: 10, right: 10 }} stroke="red"/>
              : ;
          </LineChart>
        </ResponsiveContainer>]
        visComp = visComp.concat(visComp2);
      }
      visCompAll = visCompAll.concat(visComp);

    }
    return (
        <div>
            {visCompAll}
        </div>
    );
  }
}

export default SensorChart;
