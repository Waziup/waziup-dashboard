import React, { Component } from 'react';
import { Legend, ReferenceArea, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import axios from 'axios';
import UTIL from '../../../../lib/utils.js';
import { CustomTick, indexSelection } from '../../../../lib/Visualization.js'

class SensorChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      attributes: [],
      elements: []
    };
  }

  componentDidMount() {
    this.fetchData(this.props)
  }

  //it is not wise to save historical data in Redux. For each user request, we have to make
  // a query right away to fetch the data.
  fetchData(props) {
    const sensorid = props.sensorid;
    this.setState({ attributes: props.attributes });
    const service = props.keycloak.idTokenParsed.Service;
    const sp = props.servicePath;
    const index = UTIL.getIndex(service, sp);

    axios.get('/api/v1/sensorData/search/' + index + '/' + sensorid,
      {
        headers: {
          'Fiware-Service': props.keycloak.idTokenParsed.Service,
          'Fiware-ServicePath': sp,
          'attributes': props.attributes
        }
      }).then(res => {
        const data = res.data;
        this.setState({ data: data });

        let graphElements = [];
        for (let attribute of this.state.attributes) {
          const data2 = data[attribute].map(e => { return { time: moment(e.time).valueOf(), value: e.value } });
          //let ticks = indexSelection(data2, 12);
          //console.log('data', data2, ticks);
          //<XAxis type='number' interval='preserveStartEnd' ticks={ticks} tick={<CustomTick />}  domain={['dataMin', 'dataMax']} tickFormatter={this.xFormatter} />
          //<YAxis tickFormatter={this.yFormatter} />
          //<Line name={attribute} type="basis" dataKey="value" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} />
          graphElements.push(
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={data2} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
              <XAxis interval={0} domain={['dataMin', 'dataMax']} type="number" dataKey="time" tickFormatter={this.xFormatter} />
              <YAxis />
              <Tooltip formatter={this.yFormatter} labelFormatter={this.xFormatter} />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
              <Line name={attribute} type="monotone" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} dataKey="value" />     
            </LineChart>
          </ResponsiveContainer>
          );
        }

        this.setState({ elements: graphElements });
        //this.filter(this.state.activeButton);
      }).catch(err => {
        //if (err.response.status === 403) {
        this.setState({ data: [] });
        //}
      });
  }

  xFormatter(tick) {
    return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
  }

  yFormatter(tick) {
    return tick
    //return Math.round(tick);
  }

  render() {
    //return (<ResponsiveContainer width="100%">{this.state.elements}</ResponsiveContainer>);
    return (<div>{this.state.elements}</div>);
  }
}

export default SensorChart;
