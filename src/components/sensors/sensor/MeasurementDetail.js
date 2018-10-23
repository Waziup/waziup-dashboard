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
import moment from 'moment';
import config from '../../../config';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'

class MeasurementDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      selectedDayFrom: undefined,
      selectedDayTo: undefined,
      lastN: 100,
      limit: undefined,
      offset: undefined,
      timeAxis: 'device'
    };
  }

  handleDayChangeFrom = (day) => {
    this.setState({ selectedDayFrom: moment(day).utc().format() });
  }

  handleDayChangeTo = (day) => {
    this.setState({ selectedDayTo: moment(day).utc().format() });
  }

  handleApply = () => {
    console.log('Submit clicked A', this.state.selectedDayFrom, this.state.selectedDayTo);
    this.fetchValues();
  }

  componentWillMount() {
    this.fetchValues100()
    //this.interval = setInterval(() => { this.fetchValues() }, 10000);
  }

  handleTimeAxis = (event, index, value) => {
    console.log('timeAxis', value);
    this.setState({ timeAxis: value });
  }


  fetchValues100 = () => {
    this.props.getSensor(this.props.params.sensorId);
    if (this.props.sensor) {
      this.props.getValues(this.props.params.sensorId, this.props.params.measId, { lastN: 100 });
    }
  }

  fetchValues = () => {
    this.props.getSensor(this.props.params.sensorId);

    if (this.props.sensor) {
      if (this.state.selectedDayFrom && this.state.selectedDayTo)
        this.props.getValues(this.props.params.sensorId, this.props.params.measId, { dateFrom: this.state.selectedDayFrom, dateTo: this.state.selectedDayTo });
      else
        this.fetchValues100();
    }
  }

  render() {
    //console.log("modal:" + JSON.stringify(this.state.modalOpen))
    if (this.props.meas) {
      const defaultNotif = Waziup.Notification.constructFromObject({
        condition: { sensors: [this.props.sensor.id], measurements: [this.props.meas.id], expression: "TC>30" },
        notification: { channels: [], message: "Waziup: High temperature warning. ${id} value is ${TC}", usernames: [this.props.user.username] },
        description: "Send message",
        throttling: 1
      })
      //console.log("defaultModal:" + JSON.stringify(defaultNotif))
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

      //AAA href link construction
      let aOptions;
      if (this.state.selectedDayFrom && this.state.selectedDayTo)
        aOptions = `dateFrom=${this.state.selectedDayFrom}&dateTo=${this.state.selectedDayTo}`;
      else
        aOptions = 'lastN=20';

      return (
        <Container fluid={true}>
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
              <SensorChart meas={this.props.meas} values={this.props.values} time={this.state.timeAxis} />
              <Card className="graphForm">
                <div>
                  <h4>Range from: </h4>
                    <DayPickerInput onDayChange={this.handleDayChangeFrom} />
                  <h4> To:</h4>
                    <DayPickerInput dayPickerProps={{ month: new Date(2018, 10), showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDayChangeTo} />
                </div>
                <h4>Time axis values:</h4>
                <SelectField name="timeAxis" value={this.state.timeAxis} onChange={this.handleTimeAxis} title="Time Axis">
                  <MenuItem value="cloud" primaryText="Cloud timestamp" />
                  <MenuItem value="device" primaryText="Device timestamp" />
                </SelectField>
                <div>
                  <RaisedButton type='submit' label='Update graph' onClick={this.handleApply} />
                  <a href={config.APIServerUrl + "/v1/sensors/" + this.props.sensor.id + "/measurements/" + this.props.meas.id + "/values?format=csv&" + aOptions} target="_blank">
                    <RaisedButton label="download data"/>
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
