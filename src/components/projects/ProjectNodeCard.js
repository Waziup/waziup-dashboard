import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import DeviceForm from "./../devices/device/DeviceForm";
import config from "../../config";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import deviceImage from "../../images/device.png";
import gatewayImage from "../../images/gateway.png";
import projectImage from "../../images/project.png";
import newImage from "../../images/new.png";
import ProjectForm from "./ProjectForm.js";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Link } from "react-router";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

export default class ProjectNodeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalSens: false,
      modalAdd: false,
      modalAddDevice: false,
      modalEdit: false
    };
  }

  addDevice(s) {
    let devices = this.props.project.devices;
    devices.push(s.id)
    this.props.createDevice(s);    
    this.props.updateProjectDevices(this.props.project.id,devices);
    this.props.fullProject.devices.push(s);
  }

  render() {
    let project = this.props.fullProject;    
    var devices = [];
    var gateways = [];
    if (project.devices)
      for (let d of project.devices) {
        let deviceNodeNew =
          new Date() < Date.parse(d.date_created) + config.delayDeviceNodeNew;
        const card = (
          <Link to={"/devices/" + d.id}>
            <div className="boardIcon">
              <img
                src={deviceImage}
                height="64"
                title={
                  d.dateUpdated
                    ? "Last update at " + d.dateUpdated
                    : "No data yet"
                }
              />
              {deviceNodeNew ? (
                <img src={newImage} height="35" className="newIcon" />
              ) : null}
              <br />
              <div className="Typography"> {d.name} </div>
            </div>
          </Link>
        );
        devices.push(card);
      }
    if (project.gateways)
      for (let d of project.gateways) {
        const card = (
          <Link to={"/gateways/" + d.id}>
            <div className="boardIcon">
              <img src={gatewayImage} height="90" />
              <br />
              <h3> {d.name} </h3>
            </div>
          </Link>
        );
        gateways.push(card);
      }
    console.log("perms:" + JSON.stringify(this.props.permission));
    return (
      <Card className="deviceNode">
        <DeviceForm
          modalOpen={this.state.modalAddDevice}
          handleClose={() => {
            this.setState({ modalAddDevice: false });
          }}
          onSubmit={m => {
            this.props.updateSensor(device.id, m);
            this.setState({ modalAddDevice: false });
          }}
          isEdit={false}
        />
        <DeviceForm
          handleClose={() => this.setState({ modalAddDevice: false })}
          modalOpen={this.state.modalAddDevice}
          onSubmit={s => this.addDevice(s)}
        />
        <ProjectForm
          isEdit={true}
          user={this.props.user}
          project={this.props.project}
          devices={this.props.devices}
          gateways={this.props.gateways}
          modalOpen={this.state.modalEdit}
          handleClose={() => this.setState({ modalEdit: false })}
          onSubmit={s => {
            this.props.updateProjectName(project.id, '"' + s.name + '"'),
              this.props.updateProjectDevices(project.id, s.devices),
              this.props.updateProjectGateways(project.id, s.gateways);
          }}
        />
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="left"
          spacing={24}
        >
          <Grid item md={12} lg={12}>
            <Typography>
              {this.props.permission &&
              this.props.permission.scopes.includes("projects:delete") ? (
                <div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <DeleteIcon
                      onClick={() => {
                        if (window.confirm("Delete a project?"))
                          this.props.deleteProject(project.id);
                      }}
                    />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => {
                        if (window.confirm("Delete a project?"))
                          this.props.deleteProject(project.id);
                      }}
                    >
                      Delete
                    </Button>
                  </Hidden>
                </div>
              ) : null}
              {this.props.permission &&
              this.props.permission.scopes.includes("projects:update") ? (
                <div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <EditIcon
                      onClick={() => this.setState({ modalEdit: true })}
                    />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => {
                        this.setState({ modalEdit: true });
                      }}
                    >
                      Edit
                    </Button>
                  </Hidden>
                </div>
              ) : null}
              {this.props.permission &&
              this.props.permission.scopes.includes("projects:update") ? (
                <div className="cardTitleIcons">
                  <Hidden mdUp implementation="css">
                    <AddCircleIcon
                      onClick={() => this.setState({ modalAddDevice: true })}
                    />
                  </Hidden>
                  <Hidden smDown implementation="css">
                    <Button
                      className="topRightButton"
                      variant="contained"
                      color="primary"
                      onTouchTap={() => this.setState({ modalAddDevice: true })}
                    >
                      Add a device
                    </Button>
                  </Hidden>
                </div>
              ) : null}
            </Typography>
          </Grid>
        </Grid>

        <div className="contentCards">
          <div className="boardIcon">
            <img
              src={projectImage}
              height="75"
              title={
                project.dateUpdated
                  ? "Last update at " + project.dateUpdated
                  : "No data yet"
              }
            />
            <pre>
              {" "}
              {project.owner
                ? "owner: " +
                  project.owner +
                  (this.props.user && project.owner == this.props.user.username
                    ? " (you)"
                    : "")
                : ""}{" "}
            </pre>
            <span className="Typography">
              {" "}
              {project.name ? project.name + " " : ""}{" "}
            </span>
          </div>
          <div class="gatewayDeviceNodes">
            {devices.length ? (
              <Card className="deviceNode">
                <span className="Typography"> Devices </span>
                <div className="contentCards">{devices}</div>
              </Card>
            ) : (
              ""
            )}
            {gateways.length ? (
              <Card className="deviceNode">
                <span className="Typography"> Gateways </span>
                <div className="contentCards">{gateways}</div>
              </Card>
            ) : (
              ""
            )}
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
  };
}
