import React, { Component } from 'react';
import { Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'
import { GraphLoader } from './../Loaders';

class DeviceChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartLoading: true
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log('cwrp', nextProps.time);
    if(!(nextProps.values.every((value, index) => value === this.props.values[index]))){
      this.setState({ chartLoading: false }); 
    }
  }

  getLabels(data) {
    let group = data.reduce((r, a) => {
      r[a.device_id + " -> " + a.sensor_id] = [...r[a.sensor_id] || [], a];
      return r;
     }, {});
    return Object.keys(group);
  }

  convertData(data) {
    let arr = [];
    Object.keys(data).forEach(function(key,index) {
      let obj = { time: moment(key).valueOf() };
      for (let j = 0; j < data[key].length; j++) {
        let sensor = data[key][j];
        obj[sensor.device_id + " -> " + sensor.sensor_id] = sensor.value;
      }
      arr.push(obj);
  });

  arr.sort(function(a, b){
      var keyA = new Date(a.time),
          keyB = new Date(b.time);
      if(keyA < keyB) return -1;
      if(keyA > keyB) return 1;
      return 0;
  });

    return arr;
  }

  render() {
    const xFormatter = (tick) => moment(tick).format('MMMM Do YYYY H:mm a z');
    const yFormatter = (tick) => tick
    
    if(this.props.values && this.props.sens) {


      let timeKey;
      if(this.props.timeAxis) {
        console.log('this.props.time: ', this.props.time);
        switch(this.props.timeAxis) {
          case 'device': timeKey = 'timestamp'; break;
          case 'cloud': timeKey = 'date_received'; break;
          default: timeKey = 'date_received'; 
        }
      }
  
      let group = this.props.values.reduce((r, a) => {
        if(timeKey = 'date_received')
          r[a.date_received] = [...r[a.date_received] || [], a];
        if(timeKey = 'timestamp')
          r[a.timestamp] = [...r[a.timestamp] || [], a];
        return r;
       }, {});
  
      let converted = this.convertData(group);
      let labels = this.getLabels(this.props.values);     

      const sens = this.props.sens
      const QK = Waziup.QuantityKinds.getLabel(sens.quantity_kind)
      const unit = Waziup.Units.getLabel(sens.unit);
      let colorCodes = ["#17607D", "#1FCECB", "#FF9311", "#003D5C", "#F27649", "#D5CDB6", "#008C74", "#30588C", "#263138"];
      
    
      return (
        this.state.chartLoading ? 
        GraphLoader()
        : <ResponsiveContainer  height={500} style={{margin: 30,width: '100px'}}>
          <LineChart data={converted} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
            <XAxis interval={0} domain={['dataMin', 'dataMax']} type="number" dataKey="time" tickFormatter={xFormatter} />
            <YAxis label={{ value: QK + (unit? " (" + unit + ")": ""), angle: -90, position: 'insideLeft' }}/>
            <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
            <CartesianGrid strokeDasharray="3 3" />
            <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
            {labels.map((label, index) => (
              <Line  name={label} type="monotone" stroke={colorCodes[index]} strokeWidth={2} dot={{ stroke: colorCodes[index], r: 1 }} connectNulls={true} isAnimationActive={false} key={index} dataKey={label}/>
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return null;
    }
  }
  
  static propTypes = {
    values: PropTypes.array.isRequired,
    timeAxis: PropTypes.string
  }
}

export default DeviceChart;
