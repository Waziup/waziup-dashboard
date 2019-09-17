import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { getDevices, getGateways } from "../../actions/actions.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as Waziup from "waziup-js";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import DeviceForm from "./../devices/device/DeviceForm.js";
import GatewayForm from "./../gateways/AddGatewayForm";
import Chip from '@material-ui/core/Chip';
import ErrorBanner from '../ErrorBanner';
import { Link } from "react-router";
import projectImage from '../../images/project.png';
import deviceImage from '../../images/device.png';
import gatewayImage from "../../images/gateway.png";

const styles = theme => ({
  root: {
    width: "90%"
  },
  button: {
    marginRight: theme.spacing.unit
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});

class ProjectForm extends Component {

  defaultProject = new Waziup.Project.constructFromObject({name: "My Project", device_ids: [], gateway_ids: []});

  constructor(props) {
    super(props);
    this.state = {
      modalAddDevice: false,
      modalAddGateway: false,
      activeStep: 0,
      devices: this.props.devices? this.props.devices.filter((dev) => dev.owner == this.props.user.username).sort(ProjectForm.compare): [],
      gateways: this.props.gateways? this.props.gateways: [],
      project: this.props.project ? this.props.project : this.defaultProject
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return({...prevState,
            project: nextProps.isEdit && !nextProps.modalOpen ? nextProps.project: prevState.project,  //Update project from props only in edit mode and if modal closed
            devices: nextProps.devices.filter((dev) => dev.owner == nextProps.user.username).sort(ProjectForm.compare), //Filter own devices
            gateways: nextProps.gateways});
  }
  
  static compare(a, b) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }

  handleNext = () => {
    this.setState({activeStep: this.state.activeStep + 1});
  };

  handleBack = () => {
    this.setState(state => ({activeStep: this.state.activeStep - 1}));
  };


  handleChange = (field, event) => {
    const value = event.target.value;
    var project = this.state.project;
    switch (field) {
      case "devices":
        project.device_ids = value;
        break;
      case "gateways":
        project.gateway_ids = value;
        break;
      case "name":
        project.name = value;
        break;
    }
    this.setState({ project: project });
  };

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={24}>
            <img src={projectImage} height="80" class="ProjectWizardIcon"/>
            <Grid item xs={12}>
              <a href="https://www.waziup.io/documentation/1-dashboard/">What is a project?</a>
            </Grid>
            <Grid item sm={6}>
              <TextField
                id="standard-name"
                name="name"
                label="Project name"
                value={this.state.project.name}
                fullWidth
                onChange={n => this.handleChange("name", n)}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={24}>
            <img src={deviceImage} height="80" class="ProjectWizardIcon"/>
            <DeviceForm
              gateways={this.state.gateways}
              handleClose={() => this.setState({ modalAddDevice: false })}
              modalOpen={this.state.modalAddDevice}
              onSubmit={s => {
                this.props.createDevice(s);
                this.setState({ project: {...this.state.project, device_ids: [...this.state.project.device_ids, s.id]}}), 
                this.props.getDevices();
              }}
            />
            <Grid item xs={12}>
              <a href="https://www.waziup.io/documentation/1-dashboard/">How to connect a device?</a>
            </Grid>
            <Grid item sm={6}>
              <Grid
                row
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  className="addDeviceButton"
                  onTouchTap={() => this.setState({ modalAddDevice: true })}
                >
                  Create a new device
                </Button>
                <Chip label="Or"  />
              </Grid>
            </Grid>
            <Grid item sm={6}>
              <FormControl style={{ display: "flex" }}>
                <InputLabel htmlFor="devices">Devices</InputLabel>
                <Select
                  multiple={true}
                  input={<Input name="devices" id="devices" />}
                  value={this.state.project.device_ids}
                  onChange={s => this.handleChange("devices", s)}
                >
                  {this.state.devices.map(s => (
                    <MenuItem
                      key={s.id}
                      checked={this.state.project.device_ids.includes(s.id)}
                      value={s.id}
                    >
                      {s.id}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select from existing devices</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={24}>
            <img src={gatewayImage} height="80" class="ProjectWizardIcon"/>
            <GatewayForm
              handleClose={() => this.setState({ modalAddGateway: false })}
              modalOpen={this.state.modalAddGateway}
              onSubmit={s => { 
                this.props.createGateway(s);
                this.setState({ project: {...this.state.project, gateway_ids: [...this.state.project.gateway_ids, s.id]}}), 
                this.props.getGateways();
              }}
            />
            <Grid item xs={12}>
              <a href="https://www.waziup.io/documentation/1-dashboard/">How to connect a gateway?</a>
            </Grid>
            <Grid item sm={6}>
              <Grid
                row
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <Button
                  variant="contained"
                  color="primary"
                  className="addDeviceButton"
                  onTouchTap={() => this.setState({ modalAddGateway: true })}
                >
                  Create a new gateway
                </Button>
                <Chip label="Or"  />
              </Grid>
            </Grid>
            <Grid item sm={6}>
              <FormControl style={{ display: "flex" }}>
                <InputLabel htmlFor="gateways">Gateways</InputLabel>
                <Select
                  multiple={true}
                  input={<Input name="gateways" id="gateways" />}
                  value={this.state.project.gateway_ids}
                  onChange={s => this.handleChange("gateways", s)}
                >
                  {this.state.gateways.map(s => (
                    <MenuItem
                      key={s.id}
                      checked={this.state.project.gateway_ids.includes(s.id)}
                      value={s.id}
                    >
                      {s.id}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select from existing gateways</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  }

  render() {
    const { classes } = this.props;
    const steps = ["Project details", "Add devices", "Add gateways"];
    const { activeStep } = this.state;
    const { modalOpen, handleClose, onSubmit } = this.props;
    const actions = [
      <Button
        key="cancel"
        variant="contained"
        color="primary"
        onTouchTap={() => {handleClose();}}
        className={classes.button}
      >
        Cancel
      </Button>,
      <Button
        key="back"
        disabled={activeStep === 0}
        onClick={this.handleBack}
        className={classes.button}
      >
        Back
      </Button>,
      <Button
        key="next"
        variant="contained"
        color="primary"
        disabled={activeStep >= steps.length - 1}
        onClick={this.handleNext}
        className={classes.button}
      >
        Next
      </Button>,
      <Button
        key="finish"
        variant="contained"
        color="primary"
        onTouchTap={() => {
          this.props.onSubmit(this.state.project);
          handleClose();
          this.setState({activeStep: 0, project: this.defaultProject});
        }}
        className={classes.button}
      >
        Finish
      </Button>
    ];

    return (
      <Dialog
        actions={actions}
        modal="true"
        open={modalOpen}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <hr />
        </DialogTitle>
        <DialogContent>
          <ErrorBanner/>
          <div>
            {this.getStepContent(activeStep)}
          </div>
          <br/>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
    project: PropTypes.object, //Should be a Waziup.Project
    devices: PropTypes.array, //Should be an array of ids 
    gateways: PropTypes.array, //Should be an array of ids
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEdit: PropTypes.bool
  };
}

function mapStateToProps(state) {
  return {
    devices: state.devices.devices,
    gateways: state.gateways.gateways
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDevices: params => {
      dispatch(getDevices(params));
    },
    getGateways: params => {
      dispatch(getGateways(params));
    }
  };
}

export default reduxForm({ form: "simple" })((connect(mapStateToProps,mapDispatchToProps))(withStyles(styles)(ProjectForm)));
