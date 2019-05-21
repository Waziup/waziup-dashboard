import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import DeviceForm from './../devices/device/DeviceForm';
import config from '../../config';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import deviceNodeImage from '../../images/deviceNode.png';
import gatewayImage from '../../images/RPI.png';
import newImage from '../../images/new.png';
import ProjectForm from './ProjectForm.js';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

export default class ProjectNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSens: false,
      modalAdd: false,
      modalEdit: false
    };
  }

  render() {    
    let project = this.props.project;
    
    var devices = [];
    var gateways = [];
    if (project.devices)
    for (let d of project.devices) {
      let deviceNodeNew = new Date() < Date.parse(d.date_created) + config.delayDeviceNodeNew
      const card = 
      <div className="boardIcon">
        
        <img src={deviceNodeImage} height="64" title={d.dateUpdated ? "Last update at " + d.dateUpdated : "No data yet"} />
        {deviceNodeNew ? <img src={newImage} height="35" className="newIcon" /> : null}
        <br />
        <h3> {d} </h3>
      </div>
        devices.push(card);
    }
    if (project.gateways)    
    for (let d of project.gateways) {
      const card = 
      <div className="boardIcon">        
        <img src={gatewayImage} height="90"/>
        <br />
        <h3> {d} </h3>
      </div>
        gateways.push(card);
    }
    console.log("perms:" + JSON.stringify(this.props.permission))
    return (
      <Card className="deviceNode">
        <DeviceForm modalOpen={this.state.modalAdd}
          handleClose={() => { this.setState({ modalAdd: false }) }}
          onSubmit={(m) => {
            this.props.updateSensor(device.id, m);
            this.setState({ modalAdd: false });
          }}
          isEdit={false} />
        <ProjectForm
          isEdit={true}
          project={this.props.project}
          devices={this.props.devices}
          gateways={this.props.gateways}
          modalOpen={this.state.modalEdit}
          handleClose={() => this.setState({ modalEdit: false })}
          onSubmit={s => {
            this.props.updateProjectName(project.id, '"'+s.name+'"'),
              this.props.updateProjectDevices(project.id, s.devices),
              this.props.updateProjectGateways(project.id, s.gateways)
          }} />
        <Grid container direction="row" justify="flex-start" alignItems="left" spacing={24}>
          <Grid item md={12} lg={12}>
            <Typography>
              {this.props.permission && this.props.permission.scopes.includes("projects:delete") ?
              (<div className="cardTitleIcons">
                <Hidden mdUp implementation="css">
                  <DeleteIcon onClick={() => { if (window.confirm('Delete a project?')) this.props.deleteProject(project.id) }} />
                </Hidden>
                <Hidden smDown implementation="css">
                <Button
                  className="topRightButton"
                  variant="contained"
                  color="primary"
                  onTouchTap={() => { if (window.confirm('Delete a project?')) this.props.deleteProject(project.id) }}>Delete</Button>
                </Hidden>
              </div>) : null}
              {this.props.permission && this.props.permission.scopes.includes("projects:update") ?
                (<div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon onClick={() => this.setState({ modalEdit: true })} />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => { this.setState({ modalEdit: true }) }}>Edit</Button>
                  </Hidden>
                </div>) : null}
            </Typography>
          </Grid>
        </Grid>

        <div className="contentCards">
          <div className="boardIcon">
            <img src={deviceNodeImage} height="75" title={project.dateUpdated ? "Last update at " + project.dateUpdated : "No data yet"} />
            <pre> {project.owner ? "owner: " + project.owner + (this.props.user && project.owner == this.props.user.username ? " (you)" : "") : ""} </pre>
            <span className="Typography"> {(project.name ? project.name + " " : "")} </span>
          </div>
          <div class="gatewayDeviceNodes">
          {devices.length ? 
          <Card className="deviceNode">
            <span className="Typography"> Devices </span>
            <div className="contentCards">
              {devices}
            </div>
          </Card>
          :''}
          {gateways.length ? 
          <Card>
          <span className="Typography"> Gateways </span>
            <div className="contentCards">{gateways}</div>         
          </Card>
          :''}
          </div>
        </div>
      </Card>
    );
  }

  static propTypes = {
    device: PropTypes.object.isRequired, //Should be a Waziup.Project
    updateProject: PropTypes.func,
    deleteProject: PropTypes.func,
    updateSensor: PropTypes.func,
    deleteSensor: PropTypes.func,
    permission: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }
}
