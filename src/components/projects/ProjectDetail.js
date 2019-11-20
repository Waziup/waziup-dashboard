import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Container } from "react-grid-system";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import moment from 'moment';
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import ProjectNodeCard from "./ProjectNodeCard";
import {
  deleteProject,
  getProject,
  getDevices,
  getGateways,
  getDevicePermissions,
  getProjectPermissions,
  updateProjectName,
  updateProjectDevices,
  updateProjectGateways,
  createDevice,
  createGateway,
  getValues
} from "../../actions/actions.js";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import projectImage from "../../images/project.png";
import config from '../../config';
import ProjectChart from './ProjectChart';
import { ProjectLoader, GraphLoader } from './../Loaders';

class ProjectDetail extends Component {
  interval = 0;
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      position: [14.4974, 14.4524],
      locations: [],
      sens: {id:'MB',value:{date_received: "2019-08-04T15:21:34Z",
      timestamp: "2019-08-04T15:21:26Z",
      value: "12.56"}},
      query: {
        date_from: undefined,
        date_to: undefined,
        sort: 'dsc',
        calibrated: true,
        limit: 100,
        offset: undefined,
        device_id: props.project.device_ids ? (props.project.device_ids).join() : []
      },
      devices: props.project.device_ids? props.project.device_ids: [],
      timeAxis: 'device',
      loading: true,
      chartLoading: true
    };
  }

  async componentWillMount() {
    this.props.getDevicePermissions();
    this.props.getProjectPermissions();
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.props.getProject(this.props.params.projectId, {full: true });
    this.props.getValues(this.state.query);  

    this.interval = setInterval(() => {
      this.props.getDevicePermissions();
      this.props.getProjectPermissions();
      this.props.getDevices({ limit: 1000 });
      this.props.getGateways();
      this.props.getProject(this.props.params.projectId, {full: true });
      this.props.getValues(this.state.query);  
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    const markers = [];
    const locations = [];
    if(nextProps.project && nextProps.project.devices) {

      if(nextProps.project !== this.props.project){
        var myQuery = this.state.query
        myQuery.device_id = nextProps.project.device_ids ? (nextProps.project.device_ids).join() : [];
        this.setState({ query: myQuery, devices: nextProps.project.device_ids}); 
        this.setState({ loading: false }); 
      }

      if(!this.props.loading && nextProps.isLoading === false && this.props.isLoading === true ){
        this.setState({ chartLoading: false }); 
      }

      nextProps.project.devices.forEach(device => {
        if (device.location) {
          locations.push([device.location.latitude, device.location.longitude]);
          markers.push(
            <Marker
              key={device.id}
              position={[device.location.latitude, device.location.longitude]}
            >
              <Popup>
                <span>
                  <a onClick={() => browserHistory.push(`/devices/${device.id}`)}>
                    {" "}
                    {device.id}
                  </a>
                </span>
              </Popup>
            </Marker>
          );
        }
      });
    }
    this.setState({ locations });
    this.setState({ markers });
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

  handleDeviceChange = (event) => {
    var myQuery = this.state.query;
    var value = event.target.value;
    myQuery.device_id = value.join();    
    this.setState({ devices: value, query: myQuery });
  };
  
  handleApply = () => {
    console.log('Query submit clicked: ' + JSON.stringify(this.state));
    this.props.getValues(this.state.query);  
  }

  render() {
    let renderElement = <h1> Project view is being loaded... </h1>;
    if (this.props.project) {
      renderElement = (
        <Container fluid>
          <AppBar
            position="static"
            style={{ marginBottom: "30px", background: "#e9edf2" }}
          >
            <Toolbar>
              <img src={projectImage} height="50" />
              <Typography variant="h5" className="page-title">
                Project Detail
              </Typography>
            </Toolbar>
          </AppBar>
          { this.state.loading ? 
          ProjectLoader()
          :
          <div>
            <ProjectNodeCard
              className="deviceNode"
              createDevice={this.props.createDevice}
              createGateway={this.props.createGateway}
              deleteProject={sid => {
                this.props.deleteProject(sid);
                browserHistory.push("/projects");
              }}
              permission={this.props.permission}
              project={this.props.project}
              devices={this.props.devices}
              gateways={this.props.gateways}
              updateProjectName={(id, name) => {
                this.props.updateProjectName(id, name);
                this.props.getProject(this.props.params.projectId, {full: true });
              }}
              updateProjectDevices={(id, devs) => {
                this.props.updateProjectDevices(id, devs);
                this.props.getProject(this.props.params.projectId, {full: true });
              }}
              updateProjectGateways={(id, gws) => {
                this.props.updateProjectGateways(id, gws);
                this.props.getProject(this.props.params.projectId, {full: true });
              }}
              user={this.props.user}
            />
            <Card className="deviceMap">
              <Typography>
                <span className="Typography">Device Locations </span>
              </Typography>
              <LeafletMap
                ref="map"
                center={
                  this.state.locations.length
                    ? this.state.locations[0]
                    : this.state.position
                }
                zoom={5}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                {this.state.markers}
              </LeafletMap>
            </Card>
            <Card className="graphCard" style={{ marginTop: "10px", marginBottom: "70px" }}>
              <Typography>
                <span className="Typography"> Historical chart for sensors under this project</span>
              </Typography>
              {this.state.chartLoading ? GraphLoader() : <ProjectChart sens={this.state.sens} values={this.props.values} timeAxis={this.state.timeAxis} />}
                <Grid container spacing={24}>
                  <Grid item xs={3}>
                        <h4>Range from: </h4>
                        <DayPickerInput onDayChange={this.handleDateFrom} />
                  </Grid>
                  <Grid item xs={3}>
                    <h4> To:</h4>
                    <DayPickerInput dayPickerProps={{ showWeekNumbers: true, todayButton: 'Today' }} onDayChange={this.handleDateTo} />
                  </Grid>
                  *<Grid item xs={3}>
                    <h4> Number of Datapoints:</h4>
                    <TextField name="dataPoints" value={this.state.query.limit} onChange={this.handleLimitChange}/>
                  </Grid>
                  <Grid item xs={6}>
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
                  <Grid item xs={6}>
                    <FormControl style={{ display: "flex" }}>
                      <InputLabel htmlFor="devices">Devices</InputLabel>
                      <Select
                        multiple={true}
                        input={<Input name="devices" id="devices" />}
                        value={this.state.devices}
                        onChange={s => this.handleDeviceChange(s)}
                      >
                        {this.props.project.device_ids ? 
                        this.props.project.device_ids.map(s => (
                          <MenuItem
                            key={s}
                            checked={this.state.devices.includes(s)}
                            value={s}
                          >
                            {s}
                          </MenuItem>
                        ))
                        :null}
                      </Select>
                      <FormHelperText>Filter devices</FormHelperText>
                    </FormControl>
                  </Grid>
                <Grid item xs={2}>
                  <Button type='submit' onClick={this.handleApply} className="sensorButton" variant="contained" color="primary">Update graph</Button>
                </Grid>
              </Grid>
            </Card>
          </div>
          }
        </Container>
      );
    } else {
      browserHistory.push("/projects");
    }

    return <div className="device">{renderElement}</div>;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    project: state.project.project,
    values: state.values.values,
    isLoading: state.values.isLoading,
    permission: state.permissions.project.find(
      p => p.resource == ownProps.params.projectId
    ),
    user: state.current_user,
    devices: state.devices.devices,
    gateways: state.gateways.gateways
  };
}

const mapDispatchToProps = {
  getProject,
  createDevice,
  createGateway,
  getDevicePermissions,
  getProjectPermissions,
  deleteProject,
  updateProjectName,
  updateProjectDevices,
  updateProjectGateways,
  getDevices,
  getGateways,
  getValues
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetail);
