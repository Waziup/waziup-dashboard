import moment from 'moment-timezone';
import React, { Component } from 'react';

export default class CustomTick extends Component {
    constructor(props) {
        super(props);
    }

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
        switch(this.props.viewPeriod ) {
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
