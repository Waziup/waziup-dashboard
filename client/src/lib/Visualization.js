import moment from 'moment-timezone';
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default class CustomTick extends Component {
    render() {
        //'Europe/Berlin' moment.tz.guess()
        //.tz('PKT') does not exist
        //By default, moment objects are created in the local time zone. To change the default time zone, use moment.tz.setDefault with a valid time zone.
        const time = new moment(this.props.payload.value).tz(moment.tz.guess());
        const props = this.props;
        //15th May, 2017 moment().format('MMMM Do YYYY
        //time.format('D.M.YYYY')
        //year and day views
        let tickFormat = 'H:mm MMMM Do';
        switch (this.props.viewPeriod) {
            case 'year':
                break;
            case 'month':
                tickFormat = 'H:mm Do';
                break;
            case 'week':
                tickFormat = 'H:mm Do';
                break;
            case 'day':
                break;
            default:
        }

        return (
            <g>
                <text width={props.width} height={props.height} x={props.x} y={props.y} stroke={props.stroke} fill={props.fill} textAnchor={props.textAnchor} className="recharts-text recharts-cartesian-axis-tick-value">
                    <tspan dy="1em">{time.format(tickFormat)}</tspan>
                </text>
            </g>
        );
    }
}

export class FarmViewPeriod extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeButton: 'year'
        };
    }

    isPrimary(period) {
        if (this.state.activeButton === period)
            return true;
        return false;
    }

    render() {
        return <g>
            <RaisedButton label="Year" primary={this.isPrimary('year')} onTouchTap={() => {this.setState({activeButton: 'year'});this.props.handleButtonSelected('year')}} />
            <RaisedButton label="Month" primary={this.isPrimary('month')} onTouchTap={() => {this.setState({activeButton: 'month'}); this.props.handleButtonSelected('month'); }} />
            <RaisedButton label="Week" primary={this.isPrimary('week')} onTouchTap={() => {this.setState({activeButton: 'week'}); this.props.handleButtonSelected('week'); }} />
            <RaisedButton label="Day" primary={this.isPrimary('day')} onTouchTap={() => {this.setState({activeButton: 'day'});  this.props.handleButtonSelected('day'); }} />
        </g>
    }
}

export function filterData(period, data) {
    function indexSelection(datad, tickLen) {
        let dataLen = datad.length
        let steps = Math.ceil(dataLen / tickLen)
        return datad.filter((_, index) => index % steps === 0)
    }

    let periodData;
    //ticks are filtered differently than data
    // this is to limit the number of ticks in order to not overlap in graphics
    let ticks;
    switch (period) {
        case 'year':
            periodData = data.slice(-1424)
            //max steps 120
            ticks = indexSelection(periodData.map(entry => entry.t), 12);
            break;
        case 'month':
            periodData = data.slice(-120)
            //max steps 15
            ticks = indexSelection(periodData.map(entry => entry.t), 15);
            break;
        case 'week':
            //each day: 2 ticks
            //max steps 2
            periodData = data.slice(-28)
            ticks = indexSelection(periodData.map(entry => entry.t), 14);
            break;
        case 'day':
            periodData = data.slice(-4)
            ticks = periodData.map(entry => entry.t);
            break;
        default:
            periodData = data.slice(-1424)
            ticks = indexSelection(periodData.map(entry => entry.t), 12);
    }

    return { periodData, ticks }
}

/*
class CustomTic2 extends Component {
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
}*/