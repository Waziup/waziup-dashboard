import React, { Component } from 'react';
import { CardText, CardTitle } from 'material-ui/Card';
<<<<<<< HEAD
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
//import UTIL from '../../../../utils'
//import { getHisto } from "../../../../index.js"
=======
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
>>>>>>> parent of 4cefcf1... latest updates
import moment from 'moment-timezone';
import axios from 'axios';

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
  constructor(props) {
    super(props);
    this.state = {
<<<<<<< HEAD
      data: []
=======
      data: [],
      periodData: [],
      ticks: [],
      activeButton: 'year'
>>>>>>> parent of 4cefcf1... latest updates
    };
  }

  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

<<<<<<< HEAD
  async componentWillReceiveProps(nextProps) {
    //const farmid = this.props.keycloak.idTokenParsed.ServicePath;
    const sensorid = this.props.sensorid;
    const farmid = 'farm1';
    //console.log('this.props.sensor:', this.props.sensor);
    //console.log('nextProps.sensor:', nextProps.sensor);
    console.log('this.props.sensorid:', sensorid);
    console.log('this.props.farmid (sp):', farmid);

=======
  //FIXME how to map sp to farmid, and elasticsearch index
  //because we currently use farmid as index
  async componentWillReceiveProps(nextProps) {
    console.log('wi rp')
    const sp = nextProps.servicePath;
    const sensorid = nextProps.sensorid;
    //this.setState({sensor: });
    //const sp = this.props.servicePath;
>>>>>>> parent of 4cefcf1... latest updates
    //search/:farmid/:sensorid
    //sensor={this.state.sensor} service={this.state.service} servicePath
<<<<<<< HEAD
    const res = await axios.get('/api/v1/sensorData/search/' + farmid + "/" + sensorid,
=======
    const res = await axios.get('/api/v1/sensorData/search/' + farmidOrIndex + '/' + sensorid,
>>>>>>> parent of 4cefcf1... latest updates
      {
        headers: {
          'Fiware-ServicePath': ''.concat(farmid.toUpperCase()),
          'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
<<<<<<< HEAD
          'Authorization': 'Bearer '.concat(this.props.keycloak.token)
        }
      });

    const data = res.data;
    await this.setStateAsync({ data });
  }

  render() {
    var visCompAll = [];

=======
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
>>>>>>> parent of 4cefcf1... latest updates
    function xFormatter(tick) {
      return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
    }

    function yFormatter(tick) {
      return Math.round(tick);
    }
    //<Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
<<<<<<< HEAD
    for (var measurementId in this.props.historical) {
      let unit = this.props.sensor[measurementId]["metadata"]["unit"]
      //unit = unit? unit["value"]: "";
      const YAxisLabel = unit ? measurementId + '(' + unit["value"] + ')' : measurementId;
      var visComp = [<CardText> Historical data is not available for {YAxisLabel}. </CardText>]
      if (this.props.historical[measurementId].length > 0) {
        const ticks = this.props.historical[measurementId].map(entry => entry.time);
        var title = 'Historical data graph for ' + measurementId;
        visComp = [<CardTitle title={title} />]
        var visComp2 = [
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={this.props.historical[measurementId]}
              margin={{ top: 40, right: 60, bottom: 40, left: 50 }}>

              <XAxis interval='preserveStart' dataKey="time" padding={{ left: 0, right: 20 }} label="Time"
                tickFormatter={xFormatter} ticks={ticks} tick={<CustomTick />} />

              <YAxis domain={[0, 1000]} dataKey="value" padding={{ left: 20, right: 20, bottom: 0 }} label={YAxisLabel}
                name={measurementId} tickFormatter={yFormatter} />
=======
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
>>>>>>> parent of 4cefcf1... latest updates

              <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />

              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />

<<<<<<< HEAD
              <Line name={measurementId} type="monotone" dataKey="value" fill="#8884d8" stroke="#8884d8"
                strokeWidth={2}
                dot={{ stroke: 'red', strokeWidth: 5 }}
                activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }} connectNulls={true} />

              (measurementId === 'SM1' || measurementId === 'SM2')? <ReferenceLine y={200} label="WET" padding={{ left: 10, right: 10 }} stroke="blue" />
              <ReferenceLine y={1000} label="DRY" padding={{ left: 10, right: 10 }} stroke="red" />
              : ;
          </LineChart>
=======
              <Line name={attr} type="monotone" dataKey="v" stroke="#8884d8"
                strokeWidth={2}  dot={{ stroke: '#2020f0', r: 1 }} connectNulls={false} />
            </LineChart>
>>>>>>> parent of 4cefcf1... latest updates
          </ResponsiveContainer>]
        visComp = visComp.concat(visComp2);
      }
      visCompAll = visCompAll.concat(visComp);
<<<<<<< HEAD

    }
    return (
      <div>
=======
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
>>>>>>> parent of 4cefcf1... latest updates
        {visCompAll}
      </div>
    );
  }
}

export default SensorChart;
