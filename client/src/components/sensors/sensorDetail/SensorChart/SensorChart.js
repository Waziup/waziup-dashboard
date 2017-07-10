import React, { Component } from 'react';
import { Legend, ReferenceArea, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment-timezone';
import axios from 'axios';
import CustomTick from '../../../../lib/Visualization.js';
import { filterData, FarmViewPeriod } from '../../../../lib/Visualization.js'

class SensorChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataPercent: [],
      ticks: [],
      activeButton: 'year',
      attributes: []
    };
  }

  //FIXME how to map sp to farmid, and elasticsearch index
  //because we currently use farmid as index
  async componentWillReceiveProps(nextProps) {
    console.log('wi rp')
    const sp = nextProps.servicePath;
    const sensorid = nextProps.sensorid;
    this.setState({ attributes: nextProps.attributes });
    //this.setState({sensor: });
    //const sp = this.props.servicePath;
    //search/:farmid/:sensorid
    let farmidOrIndex;
    const rootSpIndex = sp.indexOf("/", 1);
    if (rootSpIndex === -1)
      farmidOrIndex = sp.slice(1).toLowerCase();
    else
      farmidOrIndex = sp.slice(1, rootSpIndex).toLowerCase();
    //console.log('this.props.sensorid:', sensorid);
    console.log('this.props.serviePath:', sp);
    console.log('this.props.farmid (sp):', farmidOrIndex);
    //'/'.concat(farmid.toUpperCase())
    //sensor={this.state.sensor} service={this.state.service} servicePath
    await axios.get('/api/v1/sensorData/search/' + farmidOrIndex + '/' + sensorid,
      {
        headers: {
          'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
          'Fiware-ServicePath': sp,
          'Authorization': 'Bearer '.concat(this.props.keycloak.token),
          'attributes': nextProps.attributes
        }
      }).then(res => {
        const data = res.data;
        this.setState({ data: data });
        this.filter('year');
      }).catch(err => {
        if (err.response.status === 403) {
          this.setState({ data: [], dataPercent: [] });
        }
      });
  }

  filter(ab) {
    let { periodData, ticks } = filterData(ab, this.state.data);
    this.setState({
      dataPercent: periodData.map((entry) => {
        let attrsEntry = {};
        attrsEntry['t'] = entry.t;
        this.state.attributes.map(attr => (attrsEntry[attr] = this.readingToPercent(entry[attr])));
        return attrsEntry;
      }
      )
    });

    this.setState({ ticks: ticks });
  }

  handleButtonSelected(period) {
    console.log('bc')
    //changes the state of activeButton
    this.setState({ activeButton: period });
    this.filter(period);
  }

  readingToPercent(reading) {
    return Math.ceil(125 - 0.125 * parseFloat(reading))
  }

  render() {
    function xFormatter(tick) {
      return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
    }

    function yFormatter(tick) {
      return Math.round(tick);
    }

    const len = this.state.dataPercent.length
    const tlen = this.state.ticks.length
    //to start let us keep 0-20% as Over dry zone, 20 - 80% as optimal moisture zone and 80 - 100% over irrigation zone
    //this.isPrimary('month')} onTouchTap={() => { this.handleButtonSelected('month'
    return ((len === 0 || tlen === 0) ? <h1> There is no data available. </h1> :
      <div>
          <center>
            <h1>{'Period View'} </h1>
            <FarmViewPeriod handleButtonSelected={this.handleButtonSelected.bind(this)} />
            <br /><br /><br /><br />
          </center>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={this.state.dataPercent} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
              <XAxis interval={0} type="number" dataKey="t" domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={this.state.ticks} tick={<CustomTick viewPeriod={this.state.activeButton} />} />
              <YAxis domain={[0, 100]} tickFormatter={yFormatter} />
              <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
              <ReferenceArea y1={0} y2={20} strokeOpacity={0.3} stroke="red" fillOpacity={0.1} fill="red" label="Over Dry Zone" />
              <ReferenceArea y1={20} y2={80} strokeOpacity={0.3} fillOpacity={0.1} stroke="green" fill="darkgreen" label="Optimal Moisture Zone" />
              <ReferenceArea y1={80} y2={100} strokeOpacity={0.3} fillOpacity={0.1} stroke="darkblue" fill="darkblue" label="Over Irrigation Zone" />
              <Line name='SM1 (20cm)' type="monotone" dataKey="SM1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} />
              <Line name='SM2 (40cm)' type="monotone" dataKey="SM2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>   
      </div>
    );
  }
}

export default SensorChart;
