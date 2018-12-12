
import React, { Component } from 'react';
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { Container } from 'react-grid-system'
import querystring from 'querystring';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import SensorChart from './SensorChart';
import Grid from '@material-ui/core/Grid';
import MeasurementCard from './MeasurementCard';
import NotifForm from '../../notifs/NotifForm.js'
import NotifCard from '../../notifs/NotifCard.js'
import chartImage from '../../../images/chart-icon.png';
import { getValues, getSensor, addMeasurement, deleteMeasurement, createNotif } from "../../../actions/actions.js"
import config from '../../../config';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = () => ({
  button: {
    margin: theme.spacing.unit,
  }
});

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
        <Container fluid>
          <h1 className="page-title">
            <img src={chartImage} height="50" />
            Measurement: {this.props.meas.id}
          </h1>
          <Card className="sensorNode">
            <Typography>
              <span className="Typography"> Last value </span>
              {this.props.permission.scopes.includes("sensors:update") ?
                <Button onTouchTap={() => this.setState({ modalOpen: true })} variant="contained" color="primary" className="topRightButton" >Add Notification</Button> : null}
              <NotifForm modalOpen={this.state.modalOpen}
                notif={defaultNotif}
                sensors={this.props.sensors}
                users={this.props.users}
                onSubmit={this.props.createNotif}
                handleClose={() => this.setState({ modalOpen: false })}
                isEditable={true} />
            </Typography>
            <MeasurementCard measurement={this.props.meas}
              isDetails={true}
              updateMeasurement={this.props.updateMeasurement}
              deleteMeasurement={this.props.deleteMeasurement}
              sensorId={this.props.sensor.id}
              permission={this.props.permission} />
          </Card>
          {notifications.length > 0 ?
            <Card className="sensorNode">
              <Typography>
                <h2 className="Typography"> Notifications </h2>
              </Typography>
              {notifications}
            </Card> : null}
          {this.props.permission.scopes.includes("sensors-data:view") ?
            <Card className="graphCard">
              <Typography>
                <span className="Typography"> Historical chart </span>
              </Typography>
              <SensorChart meas={this.props.meas} values={this.props.values} timeAxis={this.state.timeAxis} />
              {/* <Card className="graphForm"> */}
              <Grid container spacing={24}>
            <Grid item xs={3}>
                  <h4>Range from: </h4>
                    <DayPickerInput onDayChange={this.handleDateFrom} />
            </Grid>
            <Grid item xs={3}>
              <h4> To:</h4>
              <DayPickerInput dayPickerProps={{ month: new Date(2018, 10), showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDateTo} />
            </Grid>
            <Grid item xs={12}>
              <FormControl>
                <InputLabel htmlFor="timeAxis">Use time from</InputLabel>
                <Select 
                input={<Input name="timeAxis" id="timeAxis" />}
                value={this.state.timeAxis} onChange={this.handleTimeAxis} title="Time Axis">
                  <MenuItem value="cloud">Cloud timestamp</MenuItem>
                  <MenuItem value="device">Device timestamp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          <Grid item xs={2}>
            <Button type='submit' onClick={this.handleApply} className="measurementButton" variant="contained" color="primary">Update graph</Button>
          </Grid>
          <Grid item xs={2}>
            <a href={config.APIServerUrl + "/v1/sensors/" + this.props.sensor.id + "/measurements/" + this.props.meas.id + "/values?format=csv&" + querystring.stringify(this.state.query)} target="_blank">
              <Button variant="contained" color="primary">download data</Button>
            </a>
          </Grid>
        </Grid>
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
