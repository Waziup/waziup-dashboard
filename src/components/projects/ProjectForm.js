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

function getSteps() {
  return ["Project details", "Add some devices", "Add some gateways"];
}

class ProjectForm extends Component {
  constructor(props) {
    super(props);
    const defaultProject = new Waziup.Project("MyProject");
    defaultProject.name = "My project";
    defaultProject.device_ids = [];
    defaultProject.gateway_ids = [];
    this.state = {
      newDevice: false,
      modalAddDevice: false,
      modalAddGateway: false,
      activeStep: 0,
      skipped: new Set(),
      devices: [],
      gateways: [],
      domains: ["agriculture", "fishing", "poultry"],
      project: this.props.project ? this.props.project : defaultProject
    };
  }

  componentWillMount() {
    this.getDevices();
    this.getGateways();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isEdit) {
      this.setState({ project: this.props.project });
    }
  }

  handleNext = () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }
    this.setState({
      activeStep: activeStep + 1,
      skipped
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped
      };
    });
  };

  handleReset = () => {
    const defaultProject = new Waziup.Project("MyProject");
    defaultProject.name = "My project";
    defaultProject.devices = [];
    defaultProject.gateways = [];
    this.setState({
      activeStep: 0,
      project: defaultProject
    });
  };

  isStepSkipped(step) {
    return this.state.skipped.has(step);
  }

  compare(a, b) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }

  getDevices() {
    let allDevices = this.props.devices;
    var self = this;
    let myDevices = allDevices.filter(function(device) {
      return device.owner == self.props.user.username;
    });

    let devices = myDevices.sort(this.compare);
    this.setState({ devices: devices });
  }

  getGateways() {
    let gateways = this.props.gateways;
    this.setState({ gateways: gateways });
  }

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

  addDevice(s) {
    this.props.createDevice(s);
    var project = this.state.project;
    var devices = this.state.devices;
    this.state.project.device_ids.push(s.id);
    this.state.devices.push(s);
    this.setState({ project, devices });
    this.props.getDevices();
  }

  addGateway(s) {
    this.props.createGateway(s);
    var project = this.state.project;
    var gateways = this.state.gateways;
    this.state.project.gateway_ids.push(s.id);
    this.state.gateways.push(s);
    this.setState({ project, gateways });
    this.props.getGateways();
  }

  getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <TextField
                id="standard-name"
                name="name"
                label="Project name"
                value={this.state.project.name}
                fullWidth
                onChange={n => this.handleChange("name", n)}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <FormControl style={{ display: "flex" }}>
                <InputLabel htmlFor="gateways">Domain</InputLabel>
                <Select
                  input={<Input name="gateways" id="gateways" />}
                  value={this.state.project.gateways}
                  // onChange={s => this.handleChange("gateways", s)}
                >
                  {this.state.domains.map(s => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={24}>
            <DeviceForm
              gateways={this.state.gateways}
              handleClose={() => this.setState({ modalAddDevice: false })}
              modalOpen={this.state.modalAddDevice}
              onSubmit={s => this.addDevice(s)}
            />
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
            <GatewayForm
              handleClose={() => this.setState({ modalAddGateway: false })}
              modalOpen={this.state.modalAddGateway}
              onSubmit={s => this.addGateway(s)}
            />
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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

  isStepOptional = step => {
    return step === 1 || step === 2;
  };
  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;

    const { modalOpen, handleClose, onSubmit } = this.props;
    const actions = [
      <Button
        key="cancel"
        variant="contained"
        color="primary"
        onTouchTap={() => {
          handleClose();
        }}
        className={classes.button}
      >
        Cancel
      </Button>,
      <div>
        <Button
          disabled={activeStep === 0}
          onClick={this.handleBack}
          className={classes.button}
        >
          Back
        </Button>
        {this.isStepOptional(activeStep) && activeStep !== steps.length - 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleSkip}
            className={classes.button}
          >
            Skip
          </Button>
        )}
        {activeStep !== steps.length - 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleNext}
            className={classes.button}
          >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && (
          <Button
            variant="contained"
            color="primary"
            onTouchTap={() => {
              this.props.onSubmit(this.state.project);
              handleClose();
              this.handleReset();
            }}
            className={classes.button}
          >
            Finish
          </Button>
        )}
      </div>
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
          {/* {this.props.isEdit ? "Update A Project" : "Add A Project"} */}
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const props = {};
              const labelProps = {};
              if (this.isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (this.isStepSkipped(index)) {
                props.completed = false;
              }
              return (
                <Step key={label} {...props}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <hr />
        </DialogTitle>
        <DialogContent>
          <div>
            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    You've successfully created a project
                  </Typography>
                  <Button onClick={this.handleReset} className={classes.button}>
                    Add other project
                  </Button>
                </div>
              ) : (
                <div>
                  <Typography className={classes.instructions}>
                    {this.getStepContent(activeStep)}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
    project: PropTypes.object, //Should be a Waziup.Project
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
