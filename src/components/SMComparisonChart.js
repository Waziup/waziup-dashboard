import React, { Component } from 'react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea} from 'recharts';
import axios from 'axios';
import moment from 'moment-timezone';

class CustomTick extends Component {
    constructor(props) {
        super(props);
        //console.log(props);
    }

    render() {
        const time = new moment(this.props.payload.value).tz('Europe/Berlin');
        const props = this.props;

        return (
            <g>
                <text width={props.width} height={props.height} x={props.x} y={props.y} stroke={props.stroke} fill={props.fill} textAnchor={props.textAnchor} className="recharts-text recharts-cartesian-axis-tick-value">
                    <tspan dy="1em">{time.format('H:mm')}</tspan>
                </text>
                <text width={props.width} height={props.height} x={props.x} y={props.y} stroke={props.stroke} fill={props.fill} textAnchor={props.textAnchor} className="recharts-text recharts-cartesian-axis-tick-value">
                    <tspan dy="2em">{time.format('D.M.YYYY')}</tspan>
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
        const res = await axios.get('/api/search');
        const data = res.data;
        await this.setStateAsync({ data });
    }

    render () {
        const ticks = this.state.data.map(entry => entry.t);

        function xFormatter(tick) {
            return new moment(tick).tz('Europe/Berlin').format('D.M.YYYY H:mm');
        }

        function yFormatter(tick) {
            return Math.round(tick) + '%';
        }
        function readingToPercent(reading) {
            return Math.ceil(125 - 0.125* parseFloat(reading))
        }

        let dataPercent = this.state.data.map((entry) => 
        ({'t': entry.t, 'sm1': readingToPercent(entry.sm1), 
        'sm2': readingToPercent(entry.sm2)}))

        return (
            <ResponsiveContainer width="100%" height={500}>
                <LineChart data={dataPercent} margin={{top: 5, right: 30, left: 0, bottom: 5}}>
                    <XAxis type="number" dataKey="t" domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={ticks} tick={<CustomTick/>} />
                    <YAxis domain={[0, 100]} tickFormatter={yFormatter} />
                    <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Legend align="center" verticalAlign="middle" layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
                    <ReferenceArea y1={0} y2={10} strokeOpacity={0.3} stroke="red" fillOpacity={0.1} fill="red" label="Danger zone"/>
                    <ReferenceArea y1={10} y2={30} strokeOpacity={0.3} stroke="blue" fillOpacity={0.1} fill="blue" label="Irrigation zone"/>
                    <Line name='SM1 (20cm)' type="monotone" dataKey="sm1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} connectNulls={true} />
                    <Line name='SM2 (40cm)' type="monotone" dataKey="sm2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} connectNulls={true} />
                </LineChart>
            </ResponsiveContainer>
        );
    }
}

export default SMComparisonChart;
