import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea} from 'recharts';
import axios from 'axios';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import CustomTick from '../lib/Visualization.js';
//import {CardTitle} from 'material-ui/Card';

class SMComparisonChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataPercent: [],
            ticks: [],
            activeButton: 'year'
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentWillMount() {
        const farmid = this.props.params.farmid;
        const res = await axios.get('/api/v1/sensorData/search/' + farmid, 
            {
                headers: {
                    'Fiware-ServicePath': '/'.concat(farmid.toUpperCase()),
                    'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
                    'Authorization': 'Bearer '.concat(this.props.keycloak.token)
                }
            });

        const data = res.data;
        await this.setStateAsync({ data });
        this.filterData('year');
    }

    async componentWillReceiveProps(nextProps) {
        const prevFarmId = this.props.params.farmid
        const newFarmId = nextProps.params.farmid
        //this.props.idToken.servicePath
        if (newFarmId !== prevFarmId) {
            const res = await axios.get('/api/v1/sensorData/search/' + newFarmId, {
                headers: {
                    'Fiware-ServicePath': '/'.concat(newFarmId.toUpperCase()),
                    'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
                    'Authorization': 'Bearer '.concat(this.props.keycloak.token)
                }
            });
            const data = res.data;
            await this.setStateAsync({ data });
            this.filterData(this.state.activeButton);
            this.setState({ activeButton: this.state.activeButton });
        }
    }

    //console.log(entry.sm1, isNan (entry.sm1), entry.sm2, isNan(entry.sm2))
    filterData(period) {
        function readingToPercent(reading) {
            return Math.ceil(125 - 0.125 * parseFloat(reading))
        }
        
        function indexSelection(data, tickLen) {
            let dataLen = data.length
            let steps = Math.ceil(dataLen / tickLen)
            //console.log("steps", steps)
            return data.filter((_, index) => index % steps === 0)
        }

        let periodData;
        switch(period) {
            case 'year':
                periodData = this.state.data.slice(-1424)
                //max steps 120
                this.setState({ticks: indexSelection(periodData.map(entry => entry.t), 12)});
                break;
            case 'month':
                periodData = this.state.data.slice(-120)
                //max steps 15
                this.setState({ticks: indexSelection(periodData.map(entry => entry.t), 15)});
                break;
            case 'week':
                //each day: 2 ticks
                //max steps 2
                periodData = this.state.data.slice(-28)
                this.setState({ticks: indexSelection(periodData.map(entry => entry.t), 14)});
                break;
            case 'day':
                periodData = this.state.data.slice(-4)
                this.setState({ticks: periodData.map(entry => entry.t)});
                break;
            default:
                periodData = this.state.data.slice(-1424)
                this.setState({ticks: indexSelection(periodData.map(entry => entry.t), 12)});
        }
        
        this.setState({dataPercent: periodData.filter(entry => !(isNaN(parseInt(entry.sm1)) ||
             isNaN(parseInt(entry.sm2)))).map((entry) =>
            ({'t': entry.t, 'sm1': readingToPercent(entry.sm1), 'sm2': readingToPercent(entry.sm2)}))})
    }

    handleButtonSelected(period) {
        this.setState({activeButton: period});
        this.filterData(period);
    }

    isPrimary(period) {
        if(this.state.activeButton === period)
            return true;
        return false;
    }

    render() {
        function xFormatter(tick) {
            //return new moment(tick).format('MMMM Do YYYY H:mm a z');
            return new moment(tick).tz(moment.tz.guess()).format('H:mm z MMMM Do YYYY');
        }

        function yFormatter(tick) {
            return Math.round(tick) + '%';
        }
    
        //console.log('filtered ones:', dataPercent)
        const farmId = this.props.params.farmid
        const len = this.state.dataPercent.length
        //to start let us keep 0-20% as Over dry zone, 20 - 80% as optimal moisture zone and 80 - 100% over irrigation zone
        return ( (len === 0) ? <h1> There is no data for {farmId} </h1>:
            <div>
                <center>
                    <h1>{'Farm View: ' + farmId} </h1>
                    <RaisedButton label="Year" primary={this.isPrimary('year')} onTouchTap={()=>{this.handleButtonSelected('year');}} />
                    <RaisedButton label="Month" primary={this.isPrimary('month')} onTouchTap={()=>{this.handleButtonSelected('month');}} />
                    <RaisedButton label="Week" primary={this.isPrimary('week')} onTouchTap={()=>{this.handleButtonSelected('week');}} />
                    <RaisedButton label="Day" primary={this.isPrimary('day')} onTouchTap={()=>{this.handleButtonSelected('day');}} />
                    <br/><br/><br/><br/>
                </center>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={this.state.dataPercent} margin={{top: 5, right: 60, left: 0, bottom: 15}}>
                        <XAxis interval={0} type="number" dataKey="t" domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={this.state.ticks} tick={<CustomTick viewPeriod={this.state.activeButton}/>} />
                        <YAxis domain={[0, 100]} tickFormatter={yFormatter} />
                        <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
                        <ReferenceArea y1={0} y2={20} strokeOpacity={0.3} stroke="red" fillOpacity={0.1} fill="red" label="Over Dry Zone" />
                        <ReferenceArea y1={20} y2={80} strokeOpacity={0.3}  fillOpacity={0.1} stroke="green" fill="darkgreen" label="Optimal Moisture Zone" />
                        <ReferenceArea y1={80} y2={100} strokeOpacity={0.3} fillOpacity={0.1} stroke="darkblue"  fill="darkblue" label="Over Irrigation Zone" />
                        <Line name='SM1 (20cm)' type="monotone" dataKey="sm1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} connectNulls={true} />
                        <Line name='SM2 (40cm)' type="monotone" dataKey="sm2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} connectNulls={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

function mapStateToProps(state) {
  return {
      keycloak: state.keycloak
  };
}

export default connect(mapStateToProps)(SMComparisonChart);