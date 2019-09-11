import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Container } from "react-grid-system";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
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
  createGateway
} from "../../actions/actions.js";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import projectImage from "../../images/project.png";
import config from '../../config';

class ProjectDetail extends Component {
  interval = 0;
  constructor(props) {
    super(props);
    this.state = {
      markers: [],
      position: [14.4974, 14.4524],
      locations: []
    };
  }

  componentWillMount() {
    this.props.getDevicePermissions();
    this.props.getProjectPermissions();
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.props.getProject(this.props.params.projectId, {full: true });

    this.interval = setInterval(() => {
      this.props.getDevicePermissions();
      this.props.getProjectPermissions();
      this.props.getDevices({ limit: 1000 });
      this.props.getGateways();
      this.props.getProject(this.props.params.projectId, {full: true });
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    const markers = [];
    const locations = [];
    if(nextProps.project && nextProps.project.devices) {
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
            <CardMedia>
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
            </CardMedia>
          </Card>
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
    permission: state.permissions.project.find(
      p => p.resource == ownProps.params.projectId
    ),
    user: state.current_user,
    devices: state.devices.devices,
    gateways: state.gateways.gateways
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProject: (id, options) => {
      dispatch(getProject(id, options));
    },
    createDevice: device => {
      dispatch(createDevice(device));
    },
    createGateway: device => {
      dispatch(createGateway(device));
    },
    getDevicePermissions: () => {
      dispatch(getDevicePermissions());
    },
    getProjectPermissions: () => {
      dispatch(getProjectPermissions());
    },
    deleteProject: id => {
      dispatch(deleteProject(id));
    },
    updateProjectName: (id, n) => {
      dispatch(updateProjectName(id, n));
    },
    updateProjectDevices: (id, n) => {
      dispatch(updateProjectDevices(id, n));
    },
    updateProjectGateways: (id, n) => {
      dispatch(updateProjectGateways(id, n));
    },
    getDevices: params => {
      dispatch(getDevices(params));
    },
    getGateways: params => {
      dispatch(getGateways(params));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetail);
