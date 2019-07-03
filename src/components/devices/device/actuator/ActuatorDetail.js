import React, { Component } from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import { Container } from "react-grid-system";
import ActuatorCard from "./ActuatorCard";
import actuatorImage from "../../../../images/actuator.png";
import {
  getValues,
  getDevice,
  addActuator,
  updateActuatorName,
  updateActuatorKind,
  updateActuatorValue,
  updateActuatorValueType,
  deleteActuator
} from "../../../../actions/actions.js";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  button: {
    margin: theme.spacing.unit
  }
});

class ActuatorDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  render() {
    if (this.props.actu) {
      return (
        <Container fluid={true} style={{ "padding-bottom": "100px" }}>
          <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={actuatorImage} height="50"/>
            <Typography variant="h5" className="page-title">
            Actuator: {this.props.actu.id}
            </Typography>
          </Toolbar>
        </AppBar>

          <Card className="deviceNode">
            <ActuatorCard
              actuator={this.props.actu}
              isDetails={true}
              updateActuator={this.props.updateActuator}
              updateActuatorName={this.props.updateActuatorName}
              updateActuatorKind={this.props.updateActuatorKind}
              updateActuatorValue={this.props.updateActuatorValue}
              updateActuatorValueType={this.props.updateActuatorValueType}
              deleteActuator={this.props.deleteActuator}
              deviceId={this.props.device.id}
              permission={this.props.permission}
            />
          </Card>
        </Container>
      );
    } else {
      return <h1> Actuator view is being loaded... </h1>;
    }
  }
}

function mapStateToProps(state, ownProps) {
  const device = state.device.device;
  const actu = device
    ? device.actuators.find(m => m.id == ownProps.params.actuId)
    : null;
  return {
    device: device,
    actu: actu,
    user: state.user,
    values: state.values.values,
    devices: state.devices.devices,
    users: state.users.users,
    permission: state.permissions.device.find(
      p => p.resource == ownProps.params.deviceId
    )
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getValues: opts => {
      dispatch(getValues(opts));
    },
    getDevice: id => {
      dispatch(getDevice(id));
    },
    updateActuator: (id, m) => {
      dispatch(addActuator(id, m));
    },
    updateActuatorName: (dId, aId, n) => {
      dispatch(updateActuatorName(dId, aId, n));
    },
    updateActuatorKind: (dId, aId, k) => {
      dispatch(updateActuatorKind(dId, aId, k));
    },
    updateActuatorValue: (dId, aId, v) => {
      dispatch(updateActuatorValue(dId, aId, v));
    },
    updateActuatorValueType: (dId, aId, vt) => {
      dispatch(updateActuatorValueType(dId, aId, vt));
    },
    deleteActuator: (sid, mid) => {
      dispatch(deleteActuator(sid, mid));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActuatorDetail);
