import React, { Component } from 'react';
import { Card, CardMedia, CardTitle } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import SensorChart from './SensorChart';
import MeasurementCard from './MeasurementCard';
import { connect } from 'react-redux';
import { getValues, getSensor, addMeasurement, deleteMeasurement, createNotif } from "../../../actions/actions.js"
import RaisedButton from 'material-ui/RaisedButton';
import NotifForm from '../../notifs/NotifForm.js'
import NotifCard from '../../notifs/NotifCard.js'
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import chartImage from '../../../images/chart-icon.png';
import DayPickerInput from 'react-day-picker/DayPickerInput';
require('react-day-picker/lib/style.css');
import moment from 'moment';
import config from '../../../config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'
import querystring from 'querystring'

class MeasurementDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      query: {
        dateFrom: undefined,
        dateTo: undefined,
        lastN: 100,
        limit: undefined,
        offset: undefined
      },
      timeAxis: 'device'
    };
  }

  componentWillMount() {
    this.fetchValues()
    this.interval = setInterval(() => {this.fetchValues() }, config.delayRefresh);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fetchValues = () => {
    this.props.getSensor(this.props.params.sensorId);
    this.props.getValues(this.props.params.sensorId, this.props.params.measId, this.state.query);
  }

  handleDateFrom = (day) => {
    var myQuery = this.state.query
    myQuery.dateFrom = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleDateTo = (day) => {
    var myQuery = this.state.query
    myQuery.dateTo = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleTimeAxis = (event, index, value) => {
    this.setState({ timeAxis: value });
  }
  handleApply = () => {
    console.log('Query submit clicked: ' + JSON.stringify(this.state));
    this.fetchValues();
  }

  render() {
    if (this.props.meas) {
      const defaultNotif = Waziup.Notification.constructFromObject({
        condition: { sensors: [this.props.sensor.id], measurements: [this.props.meas.id], expression: "TC>30" },
        notification: { channels: [], message: "Waziup: High temperature warning. ${id} value is ${TC}", usernames: [this.props.user.username] },
        description: "Send message",
        throttling: 1
      })
      var notifications = []
      if (this.props.notifs) {
        for (var notif of this.props.notifs) {
          const card =
            <Link to={"/notifications/" + notif.id} >
              <NotifCard className="sensorNode"
                notif={notif}
                isEditable={false} />
            </Link>
          notifications.push(card)
        }
      }

      return (
        <Container fluid={true} style={{'padding-bottom':'100px'}}>
          <h1 className="page-title">
            <img src={chartImage} height="50" />
            Measurement: {this.props.meas.id}
          </h1>
          <Card className="sensorNode">
            <CardTitle>
              <h2 className="cardTitle"> Last value </h2>
              {this.props.permission.scopes.includes("sensors:update") ?
                <RaisedButton label="Add Notification" onTouchTap={() => this.setState({ modalOpen: true })} primary={true} className="topRightButton" /> : null}
              <NotifForm modalOpen={this.state.modalOpen}
                notif={defaultNotif}
                sensors={this.props.sensors}
                users={this.props.users}
                onSubmit={this.props.createNotif}
                handleClose={() => this.setState({ modalOpen: false })}
                isEditable={true} />
            </CardTitle>
            <MeasurementCard measurement={this.props.meas}
              isDetails={true}
              updateMeasurement={this.props.updateMeasurement}
              deleteMeasurement={this.props.deleteMeasurement}
              sensorId={this.props.sensor.id}
              permission={this.props.permission} />
          </Card>
          {notifications.length > 0 ?
            <Card className="sensorNode">
              <CardTitle>
                <h2 className="cardTitle"> Notifications </h2>
              </CardTitle>
              {notifications}
            </Card> : null}
          {this.props.permission.scopes.includes("sensors-data:view") ?
            <Card className="graphCard">
              <CardTitle>
                <h2 className="cardTitle"> Historical chart </h2>
              </CardTitle>
              <SensorChart meas={this.props.meas} values={this.props.values} timeAxis={this.state.timeAxis} />
              <Card className="graphForm">
                <div>
                  <h4>Range from: </h4>
                    <DayPickerInput onDayChange={this.handleDateFrom}/>
                  <h4> To:</h4>
                    <DayPickerInput dayPickerProps={{ month: new Date(2018, 10), showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDateTo} />
                </div>
                <SelectField name="timeAxis" value={this.state.timeAxis} onChange={this.handleTimeAxis} title="Time Axis" floatingLabelText="Use time from:">
                  <MenuItem value="cloud" primaryText="Cloud timestamp" />
                  <MenuItem value="device" primaryText="Device timestamp" />
                </SelectField>
                <div>
                  <RaisedButton label='Update graph' onClick={this.handleApply} primary={true}/>
                  <span>  </span>
                  <a href={config.APIServerUrl + "/v1/sensors/" + this.props.sensor.id + "/measurements/" + this.props.meas.id + "/values?format=csv&" + querystring.stringify(this.state.query)} target="_blank" download >
                    <RaisedButton label="download data" primary={true} style={{'z-index':'0 !important'}} />
                  </a>
                </div>
              </Card>
            </Card> : null}
        </Container>
      );
    } else {
      return (<h1> Measurement view is being loaded... </h1>)
    }
  }
}

function mapStateToProps(state, ownProps) {
  const sensor = state.sensor.sensor
  const meas = sensor ? sensor.measurements.find(m => m.id == ownProps.params.measId) : null
  const notifs = meas && sensor ? state.notifications.notifications.filter(n => n.condition.sensors.includes(sensor.id) && n.condition.measurements.includes(meas.id)) : null
  return {
    sensor: sensor,
    meas: meas,
    user: state.user,
    values: state.values.values,
    sensors: state.sensors.sensors,
    users: state.users.users,
    notifs: notifs,
    permission: state.permissions.permissions.find(p => p.resource == ownProps.params.sensorId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getValues: (sid, mid, opts) => {dispatch(getValues(sid, mid, opts)) },
    getSensor: (id) => {dispatch(getSensor(id)) },
    updateMeasurement: (id, m) => {dispatch(addMeasurement(id, m)) },
    deleteMeasurement: (sid, mid) => {dispatch(deleteMeasurement(sid, mid)) },
    createNotif: (notif) => {dispatch(createNotif(notif)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementDetail);
