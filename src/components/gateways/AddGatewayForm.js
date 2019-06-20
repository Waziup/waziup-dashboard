import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PropTypes from "prop-types";
import * as Waziup from "waziup-js";

class AddGatewayForm extends Component {
  constructor(props) {
    super(props);
    const defaultGateway = new Waziup.Gateway("MyGateway");
    defaultGateway.id = "MyGateway";
    defaultGateway.name = "My Gateway";
    defaultGateway.visibility = "public";
    this.state = {
      gateway: this.props.gateway ? this.props.gateway : defaultGateway
    };
  }

  handleChange = formData => {
    var gateway = this.state.gateway;
    gateway[formData.target.name] = formData.target.value;
    this.setState({ gateway: gateway });
  };

  handleChangeVisibility = event => {
    var gateway = this.state.gateway;
    gateway.visibility = event.target.value;
    this.setState({ gateway: gateway });
  };

  render() {
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
          this.props.onSubmit(this.state.gateway);
          handleClose();
        }}
      >
        Submit
      </Button>
    ];

    return (
      <Dialog modal={true} open={modalOpen}>
        <DialogTitle>
          {this.props.isEdit ? "Update A Gateway" : "Add A Gateway"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField
                name="id"
                disabled={this.props.isEdit}
                label="Gateway ID"
                value={this.state.gateway.id}
                onChange={this.handleChange}
                title="ID used by the gateway to send data"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="name"
                label="Name"
                value={this.state.gateway.name}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl>
                <InputLabel htmlFor="visibility">Visibility</InputLabel>
                <Select
                  input={<Input name="visibility" id="visibility" />}
                  value={this.state.gateway.visibility}
                  onChange={this.handleChangeVisibility}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>{actions}</DialogActions>
      </Dialog>
    );
  }

  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
}

export default reduxForm({ form: "simple" })(AddGatewayForm);
