import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import axios from 'axios';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import CustomTick from '../lib/Visualization.js';
import { filterData, FarmViewPeriod } from '../lib/Visualization.js';
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

    readingToPercent(reading) {
        return Math.ceil(125 - 0.125 * parseFloat(reading))
    }
    
    //FIXME index to be mapped to servicePath: a solution we may provide a database
    async componentWillMount() {
        console.log('wi')
        const farmid = this.props.params.farmid;
        await axios.get('/api/v1/sensorData/search/' + farmid,
            {
                headers: {
                    'Fiware-ServicePath': '/'.concat(farmid.toUpperCase()),
                    'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
                    'Authorization': 'Bearer '.concat(this.props.keycloak.token)
                }
            }).then(res => {      
                const data = res.data;
                this.setState({data: data});
                this.filter('year');
            }).catch(err => {
                if(err.response.status === 403) {            
                    this.setState({data: [], dataPercent: []});    
                }
                //console.log(err.response)
            });
    }

    async componentWillReceiveProps(nextProps) {
        console.log('wi rp')
        const prevFarmId = this.props.params.farmid
        const newFarmId = nextProps.params.farmid
        //this.props.idToken.servicePath
        if (newFarmId !== prevFarmId) {
            await axios.get('/api/v1/sensorData/search/' + newFarmId, {
                headers: {
                    'Fiware-ServicePath': '/'.concat(newFarmId.toUpperCase()),
                    'Fiware-Service': this.props.keycloak.idTokenParsed.Service,
                    'Authorization': 'Bearer '.concat(this.props.keycloak.token)
                }
            }).then(res => {      
                //console.log(res)
                const data = res.data;
                this.setState({ data:data });       
                this.filter(this.state.activeButton);
            }).catch(err => {
                if(err.response.status === 403) {
                    this.setState({data: [], dataPercent: []});
                }
            });
        }
    }

    filter(ab) {
        let { periodData, ticks } = filterData(ab, this.state.data);
        this.setState({
            dataPercent: periodData.map((entry) =>
                    ({ 't': entry.t, 'sm1': this.readingToPercent(entry.sm1), 'sm2': this.readingToPercent(entry.sm2) }))
        })
        this.setState({ ticks: ticks });
    }

/* IF NEEDED bring it back: eriodData.filter(entry => !(isNaN(parseInt(entry.sm1)) ||
                isNaN(parseInt(entry.sm2)))).map((entry) =>
                    ({ 't': entry.t, 'sm1': this.readingToPercent(entry.sm1), 'sm2': this.readingToPercent(entry.sm2) }))*/

    handleButtonSelected(period) {
        console.log('bc')
        //changes the state of activeButton
        this.setState({ activeButton: period });
        this.filter(period);
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
        const tlen = this.state.ticks.length
        //to start let us keep 0-20% as Over dry zone, 20 - 80% as optimal moisture zone and 80 - 100% over irrigation zone
        //this.isPrimary('month')} onTouchTap={() => { this.handleButtonSelected('month'
        return ((len === 0 || tlen === 0) ? <h1> There is no data for {farmId} </h1> :
            <div>
                <center>
                    <h1>{'Farm View: ' + farmId} </h1>
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
                        <Line name='SM1 (20cm)' type="monotone" dataKey="sm1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} />
                        <Line name='SM2 (40cm)' type="monotone" dataKey="sm2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} />
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