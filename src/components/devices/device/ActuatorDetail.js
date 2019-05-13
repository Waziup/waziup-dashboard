
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
import DeviceChart from './DeviceChart';
import Grid from '@material-ui/core/Grid';
import ActuatorCard from './ActuatorCard';
import NotifForm from '../../notifs/NotifForm.js'
import NotifCard from '../../notifs/NotifCard.js'
import chartImage from '../../../images/chart-icon.png';
import { getValues, getDevice, addActuator, deleteActuator, createNotif } from "../../../actions/actions.js"
import config from '../../../config';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'

const styles = () => ({
  button: {
    margin: theme.spacing.unit,
  }
});

class ActuatorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      query: {
        dateFrom: undefined,
        dateTo: undefined,
        sort: 'asc',
        calibrated: true,
        limit: undefined,
        offset: undefined,
        deviceId: props.params.deviceId,
        actuorId: props.params.actuId
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
    myQuery.dateFrom = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleDateTo = (day) => {
    var myQuery = this.state.query
    myQuery.dateTo = moment(day).utc().format();
    this.setState({ query: myQuery});
  }

  handleLimitChange = (event) => {
    var myQuery = this.state.query
    myQuery.lastN = event.target.value;
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
    if (this.props.actu) {
     const defaultNotif = Waziup.Notification.constructFromObject({
        condition: { devices: [this.props.device.id], actuors: [this.props.actu.id], expression: "TC>30" },
        action: { channels: [], message: "Waziup: High temperature warning. ${id} value is ${TC}", usernames: [] },
        description: "Send message",
        throttling: 1
      })
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

      return (
        <Container fluid={true} style={{'padding-bottom':'100px'}}>
          <h1 className="page-title">
            <img src={chartImage} height="50" />
            Actuator: {this.props.actu.id}
          </h1>
          <Card className="deviceNode">
            <Typography>
              <span className="Typography"> Last value </span>
              {this.props.permission.scopes.includes("devices:update") ?
                <Button onTouchTap={() => this.setState({ modalOpen: true })} variant="contained" color="primary" className="topRightButton" >Add Notification</Button> : null}
              <NotifForm modalOpen={this.state.modalOpen}
                notif={defaultNotif}
                devices={this.props.devices}
                users={this.props.users}
                onSubmit={this.props.createNotif}
                handleClose={() => this.setState({ modalOpen: false })}
                isEditable={true} />
            </Typography>
            <ActuatorCard actuor={this.props.actu}
              isDetails={true}
              updateActuator={this.props.updateActuator}
              deleteActuator={this.props.deleteActuator}
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
              <DeviceChart actu={this.props.actu} values={this.props.values} timeAxis={this.state.timeAxis} />
              {/* <Card className="graphForm"> */}
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
              <h4> Data Points:</h4>
              <TextField name="dataPoints" value={this.state.query.lastN} onChange={this.handleLimitChange}/>
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
            <Button type='submit' onClick={this.handleApply} className="actuorButton" variant="contained" color="primary">Update graph</Button>
          </Grid>
          <Grid item xs={2}>
            <a href={config.APIServerUrl + "/v2/devices/" + this.props.device.id + "/actuors/" + this.props.actu.id + "/values?format=csv&" + querystring.stringify(this.state.query)} target="_blank">
              <Button variant="contained" color="primary">download data</Button>
            </a>
          </Grid>
        </Grid>
            </Card> : null}
        </Container>
      );
    } else {
      return (<h1> Actuator view is being loaded... </h1>)
    }
  }
}

function mapStateToProps(state, ownProps) {
  const device = state.device.device
  const actu = device ? device.actuors.find(m => m.id == ownProps.params.actuId) : null
  const notifs = actu && device ? state.notifications.notifications.filter(n => n.condition.devices.includes(device.id) && n.condition.actuors.includes(actu.id)) : null
  return {
    device: device,
    actu: actu,
    user: state.user,
    values: state.values.values,
    devices: state.devices.devices,
    users: state.users.users,
    notifs: notifs,
    permission: state.permissions.permissions.find(p => p.resource == ownProps.params.deviceId)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getValues: (opts) => {dispatch(getValues(opts)) },
    getDevice: (id) => {dispatch(getDevice(id)) },
    updateActuator: (id, m) => {dispatch(addActuator(id, m)) },
    deleteActuator: (sid, mid) => {dispatch(deleteActuator(sid, mid)) },
    createNotif: (notif) => {dispatch(createNotif(notif)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActuatorDetail);
