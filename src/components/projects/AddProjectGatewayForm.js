import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { getGateways } from "../../actions/actions.js";
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
import GatewayForm from "../gateways/AddGatewayForm.js";
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

class AddProjectGatewayForm extends Component {
  constructor(props) {
    super(props);
    const defaultProject = new Waziup.Project("MyProject");
    defaultProject.name = "My project";
    defaultProject.devices = [];
    defaultProject.gateways = [];
    this.state = {
      newGateway: false,
      modalAddGateway: false,
      skipped: new Set(),
      gateways: [],
      project: this.props.project ? this.props.project : defaultProject
    };
  }

  addGateway(s) {
    this.props.createGateway(s);
    var project = this.state.project;
    var gateways = this.state.gateways;
    this.state.project.gateways.push(s.id);
    this.state.gateways.push(s);
    this.setState({ project, gateways });
    this.props.getGateways();
  }

  componentWillReceiveProps() {
    if (this.props.isEdit) {
      this.setState({ project: this.props.project });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project && nextProps.project !== this.state.project) {
      this.setState({ project: nextProps.project });
    }
  }

  compare(a, b) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }

  getGateways() {
    let allGateways = this.props.gateways;
    var self = this;
    let myGateways = allGateways.filter(function(gateway) {
      return gateway.owner == self.props.user.username;
    });

    let gateways = myGateways.sort(this.compare);
    this.setState({ gateways: gateways });
  }

  componentWillMount() {
    this.getGateways();
  }

  handleChange = (field, event) => {
    const value = event.target.value;
    var project = this.state.project;
    switch (field) {
      case "gateways":
        project.gateways = value;
        break;
    }
    this.setState({ project: project });
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
          this.props.onSubmit(this.state.project);
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
        <DialogTitle>Add some gateways 
          <br />
        </DialogTitle>
        <DialogContent>
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
                  className="addGatewayButton"
                  onTouchTap={() => this.setState({ modalAddGateway: true })}
                >
                  Create a new gateway
                </Button>
                <Chip label="Or" />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <FormControl style={{ display: "flex" }}>
                <InputLabel htmlFor="gateways">Gateways</InputLabel>
                <Select
                  multiple={true}
                  input={<Input name="gateways" id="gateways" />}
                  value={this.state.project.gateways}
                  onChange={s => this.handleChange("gateways", s)}
                >
                  {this.state.gateways.map(s => (
                    <MenuItem
                      key={s.id}
                      checked={this.state.project.gateways.includes(s.id)}
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
    gateways: state.gateways.gateways
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getGateways: params => {
      dispatch(getGateways(params));
    }
  };
}

export default reduxForm({ form: "simple" })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(AddProjectGatewayForm))
);
