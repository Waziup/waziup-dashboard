import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { getDevices } from "../../actions/actions.js";
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
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import * as Waziup from "waziup-js";
import DeviceForm from "../devices/device/DeviceForm.js";
import Chip from "@material-ui/core/Chip";

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

class AddProjectDeviceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newDevice: false,
      modalAddDevice: false,
      skipped: new Set(),
      devices: [],
      gateways: [],
      projectDevices: props.project && props.project.devices ? props.project.devices.map((d) => d.id) : []
    };
  }

  addDevice(s) {
    this.props.createDevice(s);
    //TODO: this cannot work because the device might not be created (for ex. error 422, 400...)
    this.setState({ projectDevices : [...this.state.projectDevices, s.id], devices: [...this.state.devices, s] });
    this.props.getDevices();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project && nextProps.project.devices) {
      this.setState({ projectDevices: nextProps.project.devices.map((d) => d.id)});
    }
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

  componentWillMount() {
    this.getDevices();
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var projectDevices = this.state.projectDevices;
    switch (field) {
      case "devices":
        projectDevices = value;
        break;
    }
    this.setState({ projectDevices: projectDevices });
  };

  render() {
    const { classes } = this.props;

    const { modalOpen, handleClose, onSubmit } = this.props;
    const actions = [
      <Button
        color="primary"
        key="cancel"
        onTouchTap={() => {
          handleClose();
        }}
      >
        Cancel
      </Button>,
      <Button
        color="primary"
        key="submit"
        onTouchTap={() => {
          this.props.onSubmit(this.state.projectDevices);
          handleClose();
        }}
      >
        Submit
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
        <DialogTitle>Add some devices 
          <br />
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <DeviceForm
              gateways={this.state.gateways}
              handleClose={() => this.setState({ modalAddDevice: false })}
              modalOpen={this.state.modalAddDevice}
              onSubmit={s => this.addDevice(s)}
            />
            <Grid item xs={6}>
              <Grid row
                    container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
                <Button variant="contained"
                        color="primary"
                        className="addResourceButton"
                        onTouchTap={() => this.setState({ modalAddDevice: true })}>
                  Create a new device
                </Button>
                <Chip label="Or" />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{ display: "flex" }}>
                <InputLabel htmlFor="devices">Devices</InputLabel>
                <Select multiple={true}
                        input={<Input name="devices" id="devices" />}
                        value={this.state.projectDevices}
                        onChange={s => this.handleChange("devices", s)}>
                  {this.state.devices.map(s => (
                    <MenuItem key={s.id}
                              checked={this.state.projectDevices.includes(s.id)}
                              value={s.id}>
                      {s.id}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select from existing devices</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
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
    project: state.project.project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDevices: params => {
      dispatch(getDevices(params));
    }
  };
}

export default reduxForm({ form: "simple" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddProjectDeviceForm))
);
