
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
import DataChart from '../../../DataChart';
import Grid from '@material-ui/core/Grid';
import SensorCard from './SensorCard';
import CalibrationForm from './CalibrationForm';
import NotifForm from '../../../notifs/NotifForm.js'
import NotifCard from '../../../notifs/NotifCard.js'
import sensorImage from '../../../../images/sensor.png';
import { getValues, getDevice, addSensor, deleteSensor, createNotif, updateSensorCalibration } from "../../../../actions/actions.js"
import config from '../../../../config';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const styles = () => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class SensorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddNotif: false,
      modalAddCalib: false,
      query: {
        date_from: undefined,
        date_to: undefined,
        sort: 'dsc',
        calibrated: true,
        limit: 100,
        offset: undefined,
        device_id: props.params.deviceId,
        sensor_id: props.params.sensId
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
    this.props.getDevice(this.props.params.deviceId);
    this.props.getValues(this.state.query);  
  }

  handleDateFrom = (day) => {
    var myQuery = this.state.query
    myQuery.date_from = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleDateTo = (day) => {
    var myQuery = this.state.query
    myQuery.date_to = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleLimitChange = (event) => {
    var myQuery = this.state.query
    myQuery.limit = event.target.value;
    this.setState({ query: myQuery});
  }

  handleTimeAxis = (event) => {
    this.setState({ timeAxis: event.target.value });
  }
  
  handleApply = () => {
    console.log('Query submit clicked: ' + JSON.stringify(this.state));
    this.fetchValues();
  }

  render() {
    if (this.props.sens) {
      var notifications = []
      if (this.props.notifs) {
        for (var notif of this.props.notifs) {
          const card =
            <Link to={"/notifications/" + notif.id} >
              <NotifCard className="deviceNode"
                notif={notif}
                isEditable={false} />
            </Link>
          notifications.push(card)
        }
      }
     
      //construct query for downloading data: remove undefined fields
      let query = this.state.query;
      Object.keys(query).forEach(key => query[key] === undefined ? delete query[key] : '');

      return (
        <Container fluid={true} style={{'padding-bottom':'100px'}}>

          <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
            <Toolbar>
            <img src={sensorImage} height="50"/>
              <Typography variant="h5" className="page-title">
                Sensor: {this.props.sens.id}
              </Typography>
            </Toolbar>
          </AppBar>

          <Card className="deviceNode">
            <Typography>
              <span className="Typography"> Last value </span>
              {this.props.permission.scopes.includes("devices:update") ? 
                <div>
                <Button onTouchTap={() => this.setState({ modalAddNotif: true })} variant="contained" color="primary" className="topRightButton" >Add Notification</Button>
                <Button onTouchTap={() => this.setState({ modalAddCalib: true })} variant="contained" color="primary" className="topRightButton" >Calibrate</Button>
                </div> : null}
              <CalibrationForm modalOpen={this.state.modalAddCalib}
                handleClose={() => { this.setState({ modalAddCalib: false }) }}
                onSubmit={(m) => {
                  console.log(m);                  
                  this.props.updateSensorCalibration(this.props.device.id,this.props.sens.id,m);
                  this.setState({ modalAddCalib: false });
                }}
                isEdit={false} /> 
              <NotifForm modalOpen={this.state.modalAddNotif}
                devices={this.props.devices}
                users={this.props.users}
                onSubmit={this.props.createNotif}
                handleClose={() => this.setState({ modalAddNotif: false })}
                isEditable={true} />
            </Typography>
            <SensorCard sensor={this.props.sens}
              isDetails={true}
              updateSensor={this.props.addSensor}
              deleteSensor={this.props.deleteSensor}
              deviceId={this.props.device.id}
              permission={this.props.permission} />
          </Card>
          {notifications.length > 0 ?
            <Card className="deviceNode">
              <Typography>
                <h2 className="Typography"> Notifications </h2>
              </Typography>
              {notifications}
            </Card> : null}
          {this.props.permission.scopes.includes("devices-data:view") ?
            <Card className="graphCard">
              <Typography>
                <span className="Typography"> Historical chart </span>
              </Typography>
              <DataChart sens={this.props.sens}
                         values={this.props.values}
                         timeAxis={this.state.timeAxis} />
              <Grid container spacing={24}>
                <Grid item xs={3}>
                  <h4>Range from: </h4>
                  <DayPickerInput onDayChange={this.handleDateFrom} />
                </Grid>
                <Grid item xs={3}>
                  <h4> To:</h4>
                  <DayPickerInput dayPickerProps={{ showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDateTo} />
                </Grid>
                <Grid item xs={3}>
                  <h4> Number of Datapoints:</h4>
                  <TextField name="dataPoints" value={this.state.query.limit} onChange={this.handleLimitChange}/>
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
                  <Button type='submit' onClick={this.handleApply} className="sensorButton" variant="contained" color="primary">Update graph</Button>
                </Grid>
                <Grid item xs={2}>
                  <a href={config.APIServerUrl + "/v2/sensors_data?" + querystring.stringify(query)} target="_blank">
                    <Button variant="contained" color="primary">download data</Button>
                  </a>
                </Grid>
              </Grid>
            </Card> : null}
        </Container>
      );
    } else {
      return (<h1> Sensor view is being loaded... </h1>)
    }
  }
}

function mapStateToProps(state, ownProps) {
  const device = state.device.device
  const sens = device ? device.sensors.find(m => m.id == ownProps.params.sensId) : null
  const notifs = sens && device ? state.notifications.notifications.filter(n => n.condition.devices.includes(device.id) && n.condition.sensors.includes(sens.id)) : null
  return {
    device: device,
    sens: sens,
    user: state.user,
    values: state.values.values,
    devices: state.devices.devices,
    users: state.users.users,
    notifs: notifs,
    permission: state.permissions.device.find(p => p.resource == ownProps.params.deviceId)
  }
}

const mapDispatchToProps = {
  getValues,
  getDevice,
  addSensor,
  updateSensorCalibration,
  deleteSensor,
  createNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
