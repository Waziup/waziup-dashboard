import React, { Component } from 'react';
import { CardText, CardTitle } from 'material-ui/Card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment-timezone';
import axios from 'axios';
import CustomTick from '../../../../lib/Visualization.js';
import { filterData, FarmViewPeriod } from '../../../../lib/Visualization.js'

class SensorChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      periodData: [],
      ticks: [],
      activeButton: 'year'
    };
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  //FIXME how to map sp to farmid, and elasticsearch index
  //because we currently use farmid as index
  async componentWillReceiveProps(nextProps) {
    console.log('wi rp')
    const sp = nextProps.servicePath;
    const sensorid = nextProps.sensorid;
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
    const res = await axios.get('/api/v1/sensorData/search/' + farmidOrIndex + '/' + sensorid,
      {
        headers: {
          'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
          'Fiware-ServicePath': sp,
          'Authorization': 'Bearer '.concat(this.props.keycloak.token)
        }
      });

    const data = res.data;
    await this.setStateAsync({ data });
    this.filter(this.state.activeButton);
  }

  filter(ab) {
    let fperiodData = {};
    let fticks ={};
    //go over each attribute's data
    for (var attr in this.state.data) {
      let { periodData, ticks } = filterData(ab, this.state.data[attr]);
      fperiodData[attr] = periodData;
      fticks[attr] = ticks;
      //fticks.push(ticks);
    }

    this.setState({ periodData: fperiodData });
    this.setState({ ticks: fticks });
  }

  handleButtonSelected(period) {
    console.log('bc')
    //changes the state of activeButton
    this.setState({ activeButton: period });
    this.filter(period);
  }

  render() {
    var visCompAll = [];
    let graphFlag = false;
    function xFormatter(tick) {
      return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
    }

    function yFormatter(tick) {
      return Math.round(tick);
    }
    //<Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
    const data = this.state.periodData;
    const ticks = this.state.ticks;
    console.log('periodData:', data);
    console.log('ticks:', ticks);

    for (var attr in data) {
      console.log('attr:', attr);
      let YAxisLabel;
      let unit = '';//this.props.sensor[measurementId]["metadata"];
      if (!!unit["unit"] && Object.values(unit["unit"]).length !== 0)
        YAxisLabel = attr + '(' + unit["unit"]["value"] + ')';
      else
        YAxisLabel = attr;

      var visComp = [<CardText id={attr}> Historical data is not available for {YAxisLabel}. </CardText>]
      //.map(dp => dp.t);
      const datas = data[attr];
      const dlen = datas.length;

      if (!!ticks[attr] && dlen > 0 && ticks[attr].length > 0) {
        graphFlag = true;
        const tickss = ticks[attr];
        //[{"1498814161693":[378]},...]
        //({'t': entry.t, 'sm1': readingToPercent(entry.sm1), 'sm2': readingToPercent(entry.sm2)}))})
        const datass = datas.map(dp => ({ 't': dp.t, 'v': dp.v }));

        console.log('tickss', tickss);
        console.log('datass', datass);
        var title = 'Historical data graph for ' + attr;
        visComp = [<CardTitle id={attr} title={title} />]
        var visComp2 = [
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={datass}
              margin={{ top: 40, right: 60, bottom: 40, left: 50 }}>

              <XAxis interval='preserveStart' dataKey="t" padding={{ left: 0, right: 20 }} label="Time"
                tickFormatter={xFormatter} ticks={tickss} tick={<CustomTick viewPeriod={this.state.activeButton}/>} />

              <YAxis dataKey="v" padding={{ left: 20, right: 20, bottom: 0 }} label={YAxisLabel}
                name={attr} tickFormatter={yFormatter} />

              <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />

              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />

              <Line name={attr} type="monotone" dataKey="v" stroke="#8884d8"
                strokeWidth={2}  dot={{ stroke: '#2020f0', r: 1 }} connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>]
        visComp = visComp.concat(visComp2);
      }
      visCompAll = visCompAll.concat(visComp);
    }
    return (
      <div>
        {graphFlag === true &&         
        <center>
          <h1>{'Period View'} </h1>
            <FarmViewPeriod handleButtonSelected={this.handleButtonSelected.bind(this)} />
            <br /><br /><br /><br />
        </center>
        }
        {visCompAll}
      </div>
    );
  }
}

export default SensorChart;
