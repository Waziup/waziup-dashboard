
import React, { Component } from 'react';
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
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
import { getValues, getDevice, addSensor, deleteSensor, createNotif, updateSensorCalibration, pushSensorValue } from "../../../../actions/actions.js"
import config from '../../../../config';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CardActions from "@material-ui/core/CardActions";
import SensorHelp from './SensorHelp';
import HelpIcon from '@material-ui/icons/Help';

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
      timeAxis: 'device',
      newValue: 0,
      newValueValid: true
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

  submitValue() {

    if(isNaN(this.state.newValue)) {
      this.setState({newValueValid: false});
    } else {
      this.setState({newValueValid: true});
      let val = {"value": Number(this.state.newValue),
                 "timestamp": moment(new Date()).format()}
      console.log("val" + JSON.stringify(this.state.newValue));
      this.props.pushSensorValue( this.props.device.id, this.props.sens.id, val);
    }
  }

  render() {
    if (this.props.sens) {
      var notifications = []
      const defaultNotif = {
        condition: { devices: [this.props.device.id],
                     sensors: [this.props.sens.id],
                     expression: this.props.sens.id + ">30" },
        action: { type: "SocialAction",
                  value: {channels: [], 
                          message: "Waziup: High temperature warning. ${id} value is ${" + this.props.sens.id + "}",
                          usernames: [],
                          device_id: this.props.device.id,
                          actuator_value: "${" + this.props.sens.id + "}"}},
        description: "Send message",
        throttling: 1}
      if (this.props.notifs) {
        for (var notif of this.props.notifs) {
          const card =
            <Link to={"/notifications/" + notif.id} >
              <NotifCard className="longCard"
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
        <Container fluid style={{'padding-bottom':'100px'}}>
          <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
            <Toolbar>
              <img src={sensorImage} height="50"/>
              <Typography variant="h5" className="page-title">
                Sensor: {this.props.sens.id}
              </Typography>
              <div className="titleIcons">
                <SensorHelp device={this.props.device} sensor={this.props.sens} />
                <a href={config.docDashboardUrl + "/#sensors"} target="_blank">
                  <HelpIcon className="helpIcon" />
                </a>
              </div>
            </Toolbar>
          </AppBar>

          <Card className="longCard">
            <Grid container justify='space-between'>
              <Grid item ><Typography variant='h6' style={{marginLeft:10}}>Last Value</Typography> </Grid>
              <Grid item > 
                {this.props.permission.scopes.includes("devices:update") ? 
                  <div>
                  <Button onTouchTap={() => this.setState({ modalAddNotif: true })} variant="contained" color="primary" className="topRightButton" >Add Notification</Button>
                  <Button onTouchTap={() => this.setState({ modalAddCalib: true })} variant="contained" color="primary" className="topRightButton" >Calibrate</Button>
                  </div> 
                : null}
                <CalibrationForm modalOpen={this.state.modalAddCalib}
                  handleClose={() => { this.setState({ modalAddCalib: false }) }}
                  onSubmit={(m) => {
                    console.log(m);                  
                    this.props.updateSensorCalibration(this.props.device.id,this.props.sens.id,m);
                    this.setState({ modalAddCalib: false });
                  }}
                  isEdit={false} /> 
                <NotifForm  modalOpen={this.state.modalAddNotif}
                            notif={defaultNotif}
                            devices={this.props.devices}
                            users={this.props.users}
                            onSubmit={this.props.createNotif}
                            handleClose={() => this.setState({ modalAddNotif: false })}
                            isEditable={true} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <SensorCard sensor={this.props.sens}
                isDetails={true}
                updateSensor={this.props.addSensor}
                deleteSensor={this.props.deleteSensor}
                deviceId={this.props.device.id}
                permission={this.props.permission} />
              </Grid>
            </Grid>
          </Card>
          {notifications.length > 0 ?
            <Card className="longCard">
              <Typography variant='h6'style={{marginLeft:10}}>Notifications</Typography>
              {notifications}
            </Card> : null}
          {this.props.permission.scopes.includes("devices-data:view") ?
            <Card className="longCard">
              <Typography>
                <span className="Typography"> Historical chart </span>
              </Typography>
              <CardContent>
                <DataChart sens={this.props.sens}
                           values={this.props.values}
                           timeAxis={this.state.timeAxis} />
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={4} md={4} lg={3} >
                    <h4>Range from: </h4>
                    <DayPickerInput onDayChange={this.handleDateFrom} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={3}>
                    <h4> To:</h4>
                    <DayPickerInput dayPickerProps={{ showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDateTo} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={3}>
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
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <Button type='submit'
                            onClick={this.handleApply}
                            variant="contained" 
                            color="primary">
                      Update graph
                    </Button>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3} lg={2}>
                    <a href={config.APIServerUrl + "/v2/sensors_data?" + querystring.stringify(query)} target="_blank">
                      <Button variant="contained" color="primary">Download data</Button>
                    </a>
                  </Grid>
                </Grid>
              </CardContent>
            </Card> : null}
            <Card className="longCard">
              <Typography>
                <span className="Typography"> Testing zone </span>
              </Typography>
                <CardContent>
                  <InputLabel htmlFor="numberValue">Push a value to this sensor:</InputLabel>
                  <div>
                    <TextField id="numberValue"
                               name="numberValue"
                               label="Value"
                               onChange={(a) => this.setState({ newValue: a.target.value})}
                               helperText={this.state.validNumber ? "Provide a number" : "Please enter a number value"}
                               error={!this.state.newValueValid}/>
                    <Button type='submit'
                            variant="contained"
                            color="primary"
                            onTouchTap={() => {this.submitValue()}}>
                      Submit
                    </Button>
                  </div>
                </CardContent>
            </Card>
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
  createNotif,
  pushSensorValue
}

export default connect(mapStateToProps, mapDispatchToProps)(SensorDetail);
