import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectLineCard from './ProjectLineCard.js'
import { Container } from 'react-grid-system';
import { createProject, getProjects, updateProjectDevices, 
  getDevices, getGateways} from "../../actions/actions.js";
import DOM from 'react-dom-factories';
import { Link } from 'react-router';
import ProjectForm from './ProjectForm.js';
import Button from '@material-ui/core/Button';

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddProject: false,
    };
  }
  
  componentDidMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.props.getProjects({ full: true });
  }

  render() {
    return (
      <Container fluid={true} style={{paddingBottom: '100px'}}>
        <h1 className="page-title">
          Projects
        </h1>
        <ProjectForm
          devices={this.props.devices}
          gateways={this.props.gateways}
          handleClose={() => this.setState({ modalAddProject: false })}
          modalOpen={this.state.modalAddProject}
          onSubmit={s => this.props.createProject(s)}
        />
        <Button variant="contained" color="primary" className="addProjectButton" onTouchTap={() => this.setState({ modalAddProject: true })} >Create a project</Button>
        <br />
        <br />
        { DOM.div(null, 
            this.props.projects.map((p,index) => 
            React.createElement(Link, { to: "/projects/" + p.id, key: { index } },
            React.createElement(ProjectLineCard, {project: p, updateProjectDevices: this.props.updateProjectDevices, permissions: this.props.permissions, key: (index)}))
        ))
        }
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    permissions: state.permissions.permissions,
    devices: state.devices.devices,
    gateways: state.gateways.gateways
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createProject: (project) => {
      dispatch(createProject(project));
    },
    getProjects: (params) => {dispatch(getProjects(params)) },
    updateProjectDevices: (sid, gid) => {dispatch(updateProjectDevices(sid, gid)) },
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
    getGateways: (params) => {
      dispatch(getGateways(params));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);
