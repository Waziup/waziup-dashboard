import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router';
import ProjectNodeCard from './ProjectNodeCard';
import LocationForm from './LocationForm';
import {
  addSensor, deleteSensor, deleteProject, getProject, 
  getDevices, getGateways, getDevicePermissions
} from '../../actions/actions.js';
import deviceNodeImage from '../../images/deviceNode.png';
import config from '../../config';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { modalLocation: false };
  }

  componentWillMount() {
    this.props.getDevicePermissions()
    this.props.getProject(this.props.params.projectId);
  }
  componentDidMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
        Project view is being loaded...
        {' '}
      </h1>
    );
    console.log(`sens:${JSON.stringify(this.props.project)}`);
    const project = this.props.project;
    if (project) {
      // const position = project.location ? [
      //   project.location.latitude, project.location.longitude,
      // ] : [
      //   12.238, -1.561,
      // ];
      // console.log(`pos:${JSON.stringify(position)}`);
      renderElement = (
        <Container fluid>
          <h1 className="page-title">
            <img
              height="40"
              src={deviceNodeImage}
            />
            Project
          </h1>
          <ProjectNodeCard
            className="deviceNode"
            deleteSensor={this.props.deleteSensor}
            deleteProject={(sid) => {
              this.props.deleteProject(sid); browserHistory.push('/projects');
            }}
            permission={this.props.permission}
            project={project}
            devices={this.props.devices}
            gateways={this.props.gateways}
            updateSensor={this.props.addSensor}
            user={this.props.user}
          />
          <Card className="deviceMap">
            <Typography>
              <span className="Typography">
                {' '}
                Location
                {' '}
              </span>
              {this.props.permission && this.props.permission.scopes.includes('projects:update')
                ? 
                (<div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon onClick={() => { this.setState({ modalLocation: true }); }} />
                  </Hidden>
                  <Hidden smDown implementation="css">
                  <Button className="topRightButton" onTouchTap={() => { this.setState({ modalLocation: true }); }} variant="contained" color="primary" >Change</Button>
                  </Hidden>
                </div>) : null}
              {/* <LocationForm
                handleClose={() => this.setState({ modalLocation: false })}
                initialLocation={device.location}
                modalOpen={this.state.modalLocation}
                permission={this.props.permission}
              /> */}
            </Typography>
            {/* <CardMedia>
              <Map
                ref="map"
                center={position}
                zoom={5}
              >
                <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                <Marker position={position}>
                  <Popup>
                    <span>
                      Project Position
                      <br />
                      {' '}
                      Latitude:
                      {position[0]}
                      {' '}
                      <br />
                      {' '}
                      Longitude:
                      {' '}
                      {position[1]}
                    </span>
                  </Popup>
                </Marker>
              </Map>
            </CardMedia> */}
          </Card>
        </Container>
      );
    } else {
      browserHistory.push('/projects');
    }

    return (
      <div className="device">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    project: state.project.project,
    permission: state.permissions.permissions.find(p => p.resource == ownProps.params.projectId),
    user: state.current_user,
    devices: state.devices.devices,
    gateways: state.gateways.gateways
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProject: (id) => {
      dispatch(getProject(id));
    },
    addSensor: (id, m) => {
      dispatch(addSensor(id, m));
    },
    deleteSensor: (sid, mid) => {
      dispatch(deleteSensor(sid, mid));
    },
    getDevicePermissions: () => {dispatch(getDevicePermissions()) }, 
    deleteProject: (id) => {
      dispatch(deleteProject(id));
    },
    updateProjectName: (id, n) => {
      dispatch(updateProjectName(id, n));
    },
    updateSensorName: (deviceId, sensId, n) => {
      dispatch(updateSensorName(deviceId, sensId, n));
    },
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
    getGateways: (params) => {
      dispatch(getGateways(params));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
