import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea} from 'recharts';
//import {Panel} from 'react-bootstrap'
import axios from 'axios';
import moment from 'moment-timezone';
import {CardTitle} from 'material-ui/Card';

class CustomTick extends Component {
    constructor(props) {
        super(props);
        this.props.farm
        //console.log(props);
    }

    render() { 
        //'Europe/Berlin' moment.tz.guess()
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

class SMComparisonChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentDidMount() {
        //xhr.js:175 GET http://localhost:4000/api/search/farm1 net::ERR_CONNECTION_REFUSED
        //XHR failed loading: GET "http://localhost:4000/api/search/farm1"
        console.log(this.props.params.farmid)
        const res = await axios.get('http://dashboardserver.waziup.io/api/search/' + this.props.params.farmid); 
        //xhr.js:175 GET http://localhost:3000/api/search/farm2 500 (Internal Server Error)
        //const res = await axios.get('/api/search/' + this.props.params.farmid);
        // I need to full URL of that server, service name in docker
        //const res = await axios.get('http://dashboardserver.waziup.io/api/search'); // I need to full URL of that server, service name in docker
        const data = res.data;
        //console.log('data:', data)
        await this.setStateAsync({ data });
    }

    render() {
        const ticks = this.state.data.map(entry => entry.t);

        function xFormatter(tick) {
            //return new moment(tick).format('MMMM Do YYYY H:mm a z');
            return new moment(tick).tz(moment.tz.guess()).format('MMMM Do YYYY H:mm a z');
        }

        function yFormatter(tick) {
            return Math.round(tick) + '%';
        }

        function readingToPercent(reading) {
            return Math.ceil(125 - 0.125 * parseFloat(reading))
        }

        let dataPercent = this.state.data.filter(entry => !( isNaN(parseInt(entry.sm1)) || isNaN(parseInt(entry.sm2)))).map((entry) => 
        {
            //console.log(entry.sm1, isNan (entry.sm1), entry.sm2, isNan(entry.sm2))
            return {'t': entry.t, 'sm1': readingToPercent(entry.sm1), 'sm2': readingToPercent(entry.sm2)}
        })
        //to start let us keep 0-20% as Over dry zone, 20 - 80% as optimal moisture zone and 80 - 100% over irrigation zone 
        //console.log('filtered ones:', dataPercent)


        return (
            <div>
            <CardTitle title="Farm View" />
            <ResponsiveContainer width="100%" height={500}>
          
                <LineChart data={dataPercent} margin={{top: 5, right: 60, left: 0, bottom: 15}}>
                <XAxis interval={0} type="number" dataKey="t" domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={ticks} tick={<CustomTick/>} />
                    <YAxis domain={[0, 100]} tickFormatter={yFormatter} />
                    <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
                    <ReferenceArea y1={0} y2={20} strokeOpacity={0.3} stroke="red" fillOpacity={0.1} fill="red" label="Over Dry Zone"/>
                    <ReferenceArea y1={20} y2={80} strokeOpacity={0.3} stroke="green" fillOpacity={0.1} fill="darkgreen" label="Optimal Moisture Zone"/>
                    <ReferenceArea y1={80} y2={100} strokeOpacity={0.3} stroke="darkblue" fillOpacity={0.1} fill="darkblue" label="Over Irrigation Zone"/>
                    <Line name='SM1 (20cm)' type="monotone" dataKey="sm1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} connectNulls={true} />
                    <Line name='SM2 (40cm)' type="monotone" dataKey="sm2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} connectNulls={true} />
                </LineChart>
            </ResponsiveContainer>
            </div>
        );
    }
}

export default SMComparisonChart;
