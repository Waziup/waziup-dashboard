import React, { Component } from 'react';
import { Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from 'recharts';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'

class SensorChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const xFormatter = (tick) => moment(tick).format('MMMM Do YYYY H:mm a z');
    const yFormatter = (tick) => tick

    if(this.props.values && this.props.meas) {
      const meas = this.props.meas
      const data = this.props.values.map(datapoint => {return {time: moment(datapoint.date_received).valueOf(), value: datapoint.value }});
      const QK = Waziup.QuantityKinds.getLabel(meas.quantity_kind)
      const unit = Waziup.Units.getLabel(meas.unit)
      return (
        <ResponsiveContainer width="100%" height={500} className="sensorChart">
          <LineChart data={data} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
            <XAxis interval={0} domain={['dataMin', 'dataMax']} type="number" dataKey="time" tickFormatter={xFormatter} />
            <YAxis label={{ value: QK + (unit? " (" + unit + ")": ""), angle: -90, position: 'insideLeft' }}/>
            <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
            <Line name={this.props.meas.name} type="monotone" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return null;
    }
  }
  
  static propTypes = {
    meas: PropTypes.object.isRequired,
    values: PropTypes.array.isRequired
  }
}

export default SensorChart;
