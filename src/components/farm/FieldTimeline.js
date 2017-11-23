import axios from 'axios';
import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Update from 'material-ui/svg-icons/content/create';
import Delete from 'material-ui/svg-icons/action/delete';
import { Timeline, TimelineEvent } from 'react-event-timeline';
import { blue500, red500 } from 'material-ui/styles/colors';
import { CardTitle } from 'material-ui/Card';
import moment from 'moment';

class FieldTimeline extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(props) {
    //console.log('new props', props)
  }

  f(d) {
    return moment(d).format('YYYY-MM-DD HH:mm a z');
  }

  deleteEvent(id) {
    axios.delete('/api/v1/sensorData/farmevents/' + this.props.index + '/' + id,
      {
        headers: {
          'Fiware-Service': this.props.service,
          'Fiware-ServicePath': this.props.sp,
        }
      }).then(res => {
        const data = res;
        this.props.fetchEventData(this.props.index, this.props.service, this.props.sp);
      }).catch(err => {
        if (!!err.response && err.response.status === 403) {
          const data = err.response;
          console.log(JSON.stringify(data));
        }
      });
  }

/*
  updateEvent(id) {
    <IconButton tooltip="Update" tooltipPosition="top-center" onTouchTap={() => { this.updateEvent(e.id) }}>
    <Update color={blue500} />
  </IconButton>
    axios.put('/api/v1/sensorData/farmevents/' + this.props.index + '/' + id,
      {
        headers: {
          'Fiware-Service': this.props.service,
          'Fiware-ServicePath': this.props.sp,
        }
      }).then(res => {
        const data = res;
        this.props.fetchEventData(this.props.index, this.props.service, this.props.sp);
      }).catch(err => {
        if (!!err.response && err.response.status === 403) {
          const data = err.response;
          console.log(JSON.stringify(data));
        }
      });
  }*/

  render() {
    //<i class="material-icons">face</i>
    return (
      <div>
        <CardTitle title="Event Timeline" />
        {(this.props.farmEvents.length > 0) && 
          <table>
          <tr>
            <th>Events</th>
            <th></th>
          </tr>
          <tbody>
          <Timeline>
            {
              this.props.farmEvents.map(e =>
                (<tr>
                  <td width={500}>
                    <TimelineEvent
                      title={'Event Type: ' + e.value.eventType.value}
                      createdAt={this.f(e.t)}
                      icon={<Update color={blue500} />}
                      iconColor='#00BCD4'
                      style={{ backgroundColor: '#fff', fontSize: 11, padding: 5, boxShadow: '0 0 3px 1px #00BCD4', border: '1px solid #eee' }}
                      contentStyle={{ backgroundColor: '#0ABCD4', fontSize: 10, color: '#fff' }}
                    >
                      Description: {e.value.description.value} <br/>
                      Quantity: {e.value.quantity.value}
                    </TimelineEvent>
                  </td>
                  <td>
                    <g>
                    <IconButton tooltip="Delete" tooltipPosition="top-center" onTouchTap={() => { this.deleteEvent(e.id) }}>
                      <Delete color={red500} />
                    </IconButton>
                    </g>
                  </td>
                </tr>
                )
              )
            }
          </Timeline>
          </tbody>
          </table>
        }
      </div>
    );
  }
}

export default FieldTimeline;