import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

class CalibrationForm extends Component {
  constructor(props) {
    super(props);
    var defaultCalib = {
      linear: {
        enabled: false,
        value_max: {
          sensor_value: 300,
          real_value: 0
        },
        value_min: {
          sensor_value: 900,
          real_value: 100
        }
      }
    };
    this.state = {
      calib: this.props.calibration ? this.props.calibration : defaultCalib
    };
  }

  handleChange = formData => {
    var calib = this.state.calib;
    const value = parseFloat(formData.target.value) || 0;
    if(formData.target.name == "realValueMax")
      calib.linear.value_max.real_value =  value;
    else if(formData.target.name == "sensValueMax")
      calib.linear.value_max.sensor_value = value;  
    else if(formData.target.name == "realValueMin")
      calib.linear.value_min.real_value = value;  
    else if(formData.target.name == "sensValueMin")
      calib.linear.value_min.sensor_value = value; 
    else if(formData.target.name == "enabled")
      calib.linear.enabled = !calib.linear.enabled;    
    this.setState({ calib: calib });
  };

  render() {
    const actions = [
      <Button
        color="primary"
        key="cancel"
        onTouchTap={() => {
          this.props.handleClose();
        }}
      >
        Cancel
      </Button>,
      <Button
        color="primary"
        key="submit"
        onTouchTap={() => {
          this.props.onSubmit(this.state.calib);
          this.props.handleClose();
        }}
      >
        Submit
      </Button>
    ];

    return (
      <Dialog
        actions={actions}
        modal={true}
        open={this.props.modalOpen}
        autoScrollBodyContent={true}
      >
        <DialogTitle>Calibration</DialogTitle>
        <DialogContent>
          <div className="locationCoords">
            <Grid container spacing={24}>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <Typography>Value Max</Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <TextField
                  name="sensValueMax"
                  label="Sensor Value"
                  value={this.state.calib.linear.value_max.sensor_value}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <TextField
                  name="realValueMax"
                  label="Real Value"
                  value={this.state.calib.linear.value_max.real_value}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <Typography>Value Min</Typography>
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <TextField
                  name="sensValueMin"
                  label="Sensor Value"
                  value={this.state.calib.linear.value_min.sensor_value}
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xs={2} />
              <Grid item xs={10}>
                <TextField
                  name="realValueMin"
                  label="Real Value"
                  value={this.state.calib.linear.value_min.real_value}
                  onChange={this.handleChange}
                />
              </Grid>
              <FormControlLabel
                    control={
                      <Switch
                        name="enabled"
                        checked={this.state.calib.linear.enabled}
                        onChange={this.handleChange}
                        value={this.state.calib.linear.enabled}
                        color="primary"
                      />
                    }
                    label="Enabled"
                  />
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
    calibration: PropTypes.object, //Waziup.calibration
    modalOpen: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
}

export default reduxForm({
  form: "simple"
})(CalibrationForm);
