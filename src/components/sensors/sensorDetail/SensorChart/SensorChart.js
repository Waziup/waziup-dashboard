import React, { Component } from 'react';
import { Legend, ReferenceArea, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import UTIL from '../../../../lib/utils.js';
import { CustomTick, indexSelection } from '../../../../lib/Visualization.js'

class SensorChart extends Component {
  constructor(props) {
    super(props);
  }

  xFormatter(tick) {
    return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
  }

  yFormatter(tick) {
    return tick
  }

  render() {
    let graphElements = [];
    for (let meas of this.props.measurements) {
      const data2 = meas.values.map(datapoint => { return { time: moment(datapoint.timestamp).valueOf(), value: datapoint.value } });
      graphElements.push(
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={data2} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
          <XAxis interval={0} domain={['dataMin', 'dataMax']} type="number" dataKey="time" tickFormatter={this.xFormatter} />
          <YAxis />
          <Tooltip formatter={this.yFormatter} labelFormatter={this.xFormatter} />
          <CartesianGrid strokeDasharray="3 3" />
          <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
          <Line name={meas.name} type="monotone" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} dataKey="value" />
        </LineChart>
      </ResponsiveContainer>
      );
    }
    return (<div>{graphElements}</div>);
  }
}

export default SensorChart;
