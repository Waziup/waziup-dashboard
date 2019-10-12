import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectLineCard from './ProjectLineCard.js'
import { Container } from 'react-grid-system';
import { createProject, createDevice, createGateway, getProjects, updateProjectDevices, 
  getDevices, getGateways} from "../../actions/actions.js";
import config from '../../config';  
import DOM from 'react-dom-factories';
import { Link } from 'react-router';
import ProjectForm from './ProjectForm.js';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import projectImage from '../../images/project.png';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { ListLoader } from './../Loaders';

class Projects extends Component {
  interval = 0;
  constructor(props) {
    super(props);
    this.state = {
      modalAddProject: false,
      loading: true
    };
  }

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.props.getProjects({ full: false });
    this.interval = setInterval(() => {
      this.props.getProjects({ full: false });
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps() { 
    this.setState({loading: false})
  }
  
  render() {
    return (
      <Container fluid={true} style={{paddingBottom: '100px'}}>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={projectImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Projects       
            </Typography>
          </Toolbar>
        </AppBar>
        <ProjectForm
          user={this.props.user}
          devices={this.props.devices}
          gateways={this.props.gateways}
          handleClose={() => this.setState({ modalAddProject: false })}
          modalOpen={this.state.modalAddProject}
          createDevice={this.props.createDevice}
          createGateway={this.props.createGateway}
          onSubmit={s => this.props.createProject(s)}
        />
        <Button variant="contained"
                color="primary"
                className="addDeviceButton"
                onTouchTap={() => this.setState({ modalAddProject: true })}>
          Create a project
        </Button>
        <br/>
        <br/>
        <div style={{marginTop: '20px'}}>
          {
            this.state.loading ? 
            ListLoader()
            :
            this.props.projects.length != 0 ? DOM.div(null, 
              this.props.projects.map((p,index) => [
              this.props.settings.showPublicResources ? (
                React.createElement(Link, { to: "/projects/" + p.id, key: { index } },
                React.createElement(ProjectLineCard, {project: p, updateProjectDevices: this.props.updateProjectDevices, permissions: this.props.permissions, key: (index)}))  
              ):
              ((p.owner == this.props.user.username) && 
                React.createElement(Link, { to: "/projects/" + p.id, key: { index } },
                React.createElement(ProjectLineCard, {project: p, updateProjectDevices: this.props.updateProjectDevices, permissions: this.props.permissions, key: (index)}))  
              )])) : 
          <div>
          <Paper style={{'padding':'20px'}}>
            <Typography variant="h5" component="h3">
            You don't have any projet.
            </Typography>
            <Typography component="p">
              Get started by creating your own IoT project.
            </Typography>
          </Paper>
        </div>
        }
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    permissions: state.permissions.project,
    devices: state.devices.devices,
    gateways: state.gateways.gateways,
    user: state.current_user,
    settings: state.settings
  };
}

const mapDispatchToProps = {
  createProject,
  createDevice,
  createGateway,
  getProjects,
  updateProjectDevices,
  getDevices,
  getGateways
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
