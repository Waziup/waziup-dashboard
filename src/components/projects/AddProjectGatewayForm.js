import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
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
    this.state = {
      newGateway: false,
      modalAddGateway: false,
      skipped: new Set(),
      devices: [],
      gateways: [],
      projectGateways: props.project && props.project.gateways ? props.project.gateways.map((d) => d.id) : []
    };
  }

  addGateway(s) {
    this.props.createGateway(s);
    this.setState({ projectGateways : [...this.state.projectGateways, s.id], gateways: [...this.state.gateways, s] });
    this.props.getGateways();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project && nextProps.project.gateways) {
      this.setState({ projectGateways: nextProps.project.gateways.map((d) => d.id)});
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
    var projectGateways = this.state.projectGateways;
    switch (field) {
      case "gateways":
        projectGateways = value;
        break;
    }
    this.setState({ projectGateways: projectGateways });
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
          this.props.onSubmit(this.state.projectGateways);
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
                  value={this.state.projectGateways}
                  onChange={s => this.handleChange("gateways", s)}
                >
                  {this.state.gateways.map(s => (
                    <MenuItem
                      key={s.id}
                      checked={this.state.projectGateways.includes(s.id)}
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
    gateways: state.gateways.gateways,
    project: state.project.project
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
