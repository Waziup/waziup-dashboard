import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import Update from 'material-ui/svg-icons/content/create';
import {Timeline, TimelineEvent} from 'react-event-timeline';
import {blue500, red500} from 'material-ui/styles/colors';
import { CardTitle} from 'material-ui/Card';
import moment from 'moment';

class FieldTimeline extends Component {

  render() {
    const { sensor } = this.props;

    const date = moment(sensor.dateModified.value,'YYYY-MM-DD HH:mm');
console.log(date.toString());
    return (
      <div>
      <CardTitle title="Event Timeline" />
      <Timeline>
        <TimelineEvent
          title={'Action type : ' + sensor['farming-action'].value}
          createdAt={date.toString()}
          icon={<Update color={blue500}/>}
          iconColor='#00BCD4'
          style={{backgroundColor: '#fff',fontSize:14, padding: 10, boxShadow: '0 0 3px 1px #00BCD4', border: '1px solid #eee'}}
          contentStyle={{backgroundColor: '#00BCD4', color: '#fff'}}
        >
          {sensor['farming-action'].metadata.description.value}
        </TimelineEvent>
      </Timeline>
      </div>
    );
  }

}

export default FieldTimeline;
