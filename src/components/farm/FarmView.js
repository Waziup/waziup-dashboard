import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import axios from 'axios';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { CustomTick } from '../../lib/Visualization.js';
import { filterData, FarmViewPeriod } from '../../lib/Visualization.js';
import UTIL from '../../lib/utils.js';
import { Map, Polygon, TileLayer } from 'react-leaflet';
import { CardMedia, CardTitle } from 'material-ui/Card';
import FieldTimeline from './FieldTimeline.js';
import EventForm from '../event/eventsForm/EventFormContainer.js'
import RaisedButton from 'material-ui/RaisedButton';
import {updateSensorFarmAction} from "../../api-adapter.js"

class FarmView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: 0,
            data: [],
            dataPercent: [],
            ticks: [],
            activeButton: 'week',
            update: false,
            modalOpen: false,
            modalEventOpen: false,
            farm: {},
            farmEvents: []
        };

    }

    getIndexFromFarmName(farmName) {
        return farmName.replace('FARM-', '').toLowerCase()
    }

    findSetFarmEntity(props) {
        const farmId = props.params.index
        const farm = props.sensors.sensors.find(
            (el) => (el.id === farmId));

        if (!!farm) {
            this.setState({ isLoading: this.state.isLoading + 1 });
            this.setState({ farm: farm });
        }
    }

    handleEventClose = () => {
        this.setState({ modalEventOpen: false });
    }

    handleEventOpen = () => {
        this.setState({ modalEventOpen: true });
    }

    handleEventSubmit = (values) => {
        const sp = this.state.farm.servicePath.value;
        const service = this.props.keycloak.idTokenParsed.Service;
        this.props.updateSensorFarmAction(service, sp, this.state.farm.id, values);
        const index = this.getIndexFromFarmName(this.props.params.index)
        setTimeout(() => {this.fetchEventData(index, service, sp);}, 2000);     
    }


    componentWillReceiveProps(newProps) {
        this.findSetFarmEntity(newProps);
        console.log('cwrp: ', newProps);
    }

    fetchData(props) {
        //index is also farmId
        const index = this.getIndexFromFarmName(props.params.index)
        const service = props.keycloak.idTokenParsed.Service;
        const sp = UTIL.getServicePath(service, index);

        axios.get('/api/v1/sensorData/search/' + index,
            {
                headers: {
                    'Fiware-Service': service,
                    'Fiware-ServicePath': sp
                }
            }).then(res => {
                const data = res.data;
                this.setState({ data: data });
                this.filter(this.state.activeButton);
                this.setState({ isLoading: this.state.isLoading + 1 });
            }).catch(err => {
                console.error('errro in getting farm data')
                //if (err.response.status === 403 || err.response.status === 500) {
                this.setState({ data: [], dataPercent: [] });
                //}
            });

        this.fetchEventData(index, service, sp);
    }

    fetchEventData(index, service, sp) {
        //console.log('farm events call');
        axios.get('/api/v1/sensorData/farmevents/' + index,
            {
                headers: {
                    'Fiware-Service': service,
                    'Fiware-ServicePath': sp,
                }
            }).then(res => {
                const data = res.data;
                //console.log(JSON.stringify(data));
                this.setState({ farmEvents: data });
                return data;
            }).catch(err => {
                if (!!err.response && err.response.status === 403) {
                    this.setState({ farmEvents: [] });
                }
            });
    }

    componentDidMount() {
        this.fetchData(this.props);
        this.findSetFarmEntity(this.props);
    }

    filter(ab) {
        let { periodData, ticks } = filterData(ab, this.state.data);
        this.setState({
            dataPercent: periodData.map((entry) =>
                ({
                    't': entry.t, 'sm1': this.readingToPercent(entry.sm1),
                    'sm2': this.readingToPercent(entry.sm2)
                }))
        })
        this.setState({ ticks: ticks });
    }

    handleButtonSelected(period) {
        //changes the state of activeButton
        this.setState({ activeButton: period });
        this.filter(period);
    }


    readingToPercent_prev(reading) {
        let v = Math.ceil(125 - 0.125 * parseFloat(reading))

        if (v > 100)
            v = 100

        if (v < 0)
            v = 0
        return v
    }

    readingToPercent(r) {
        let v = 0;
        const reading = parseFloat(r);

        if (reading <= 100)
            v = 100;
        else if (reading <= 500)
            v = 120 - 0.2 * reading;
        /*else if (reading <= 300)
            v = 120 - 0.2 * reading;
        else if (reading <= 400)
            v = 40;
        else if (reading <= 500)*/
        else
            v = 40 - 0.04 * reading;

        return v
    }

    render() {
        function xFormatter(tick) {
            return new moment(tick).tz(moment.tz.guess()).format('H:mm z MMMM Do YYYY');
        }

        function yFormatter(tick) {
            return Math.round(tick) + '%';
        }


        let farmMap = [];
        let centerPosition;
        //console.log('render', this.props);

        const len = this.state.dataPercent.length
        const tlen = this.state.ticks.length
        const overIrrigationZone = !!this.state.farm.overIrrigationZone ? this.state.farm.overIrrigationZone.value : 40;
        const overDryZone = !!this.state.farm.overDryZone ? this.state.farm.overDryZone.value : 80;

        const service = this.props.keycloak.idTokenParsed.Service;
        //to start let us keep 0-20% as Over dry zone, 20 - 80% as optimal moisture zone and 80 - 100% over irrigation zone
        //                            
        if (this.state.isLoading === 2) {
            if (!!this.state.farm.location) {
                farmMap = <Polygon color="purple" positions={UTIL.convertLonLatToLatLon(this.state.farm.location.value.coordinates)} />;
                centerPosition = this.state.farm.location.value.coordinates[0][0];
                centerPosition = [centerPosition[1], centerPosition[0]];
            }
        }

        return (
            <div>
                {this.state.isLoading < 2 ?
                    <h1> Farm View is being loaded... </h1>
                    : <center>
                        <h1>{'Farm View: ' + this.state.farm.name.value} </h1>
                        <EventForm ref={'eventForm'} modalOpen={this.state.modalEventOpen} handleClose={this.handleEventClose}
                            onSubmit={this.handleEventSubmit} />

                        <FarmViewPeriod defaultActiveButton={this.state.activeButton}
                            handleButtonSelected={this.handleButtonSelected.bind(this)} />
                        <br /><br /><br /><br />
                        <ResponsiveContainer width="100%" height={500}>
                            <LineChart data={this.state.dataPercent} margin={{ top: 5, right: 60, left: 0, bottom: 15 }}>
                                <XAxis interval={0} type="number" dataKey="t" domain={['dataMin', 'dataMax']} tickFormatter={xFormatter} ticks={this.state.ticks} tick={<CustomTick viewPeriod={this.state.activeButton} />} />
                                <YAxis domain={[0, 100]} tickFormatter={yFormatter} />
                                <Tooltip formatter={yFormatter} labelFormatter={xFormatter} />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Legend align='right' verticalAlign='top' layout="vertical" wrapperStyle={{ right: '35px', top: '10px', border: '2px solid beige', padding: '5px 0px 5px 5px' }} />
                                <ReferenceArea y1={0} y2={overDryZone} strokeOpacity={0.3} stroke="red" fillOpacity={0.1} fill="red" label="Over Dry Zone" />
                                <ReferenceArea y1={overDryZone} y2={overIrrigationZone} strokeOpacity={0.3} fillOpacity={0.1} stroke="green" fill="darkgreen" label="Optimal Moisture Zone" />
                                <ReferenceArea y1={overIrrigationZone} y2={100} strokeOpacity={0.3} fillOpacity={0.1} stroke="darkblue" fill="darkblue" label="Over Irrigation Zone" />
                                <Line name='SM1 (20cm)' type="monotone" dataKey="sm1" stroke="#00c000" strokeWidth={2} dot={{ stroke: '#00c000', r: 1 }} isAnimationActive={false} />
                                <Line name='SM2 (40cm)' type="monotone" dataKey="sm2" stroke="#2020f0" strokeWidth={2} dot={{ stroke: '#2020f0', r: 1 }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                        <RaisedButton label="Create an event/action" primary={true} onTouchTap={() => { this.handleEventOpen(); }} />
                        {this.state.farmEvents.length > 0 &&
                            <FieldTimeline service={service} sp={this.state.farm.servicePath.value}
                                index={this.getIndexFromFarmName(this.state.farm.id)}
                                fetchEventData={this.fetchEventData.bind(this)} farmEvents={this.state.farmEvents} />}
                        {!!this.state.farm.location && <g>
                            <CardTitle title="Farm Entity on the Map" />
                            <CardMedia>
                                <Map ref="map" center={centerPosition} zoom={10}>
                                    <TileLayer
                                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {farmMap}
                                </Map>
                            </CardMedia>
                        </g>
                        }
                    </center>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        keycloak: state.keycloak,
        sensors: state.sensors
    };
}
function mapDispatchToProps(dispatch) {
    return {
      updateSensorFarmAction: (service, servicePath, sensorId, recordType, recordQuantity, recordDescription) => {
        dispatch(updateSensorFarmAction(service, servicePath, sensorId, recordType, recordQuantity, recordDescription))
      }
    };
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(FarmView);
//USE if needed. now it is not needed connectNulls={true}