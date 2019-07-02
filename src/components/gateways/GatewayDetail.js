import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router';
import GatewayNodeCard from './GatewayNodeCard'
import {
  addSensor, deleteSensor, deleteGateway, getGateways, updateSensorName,
  addActuator, deleteActuator, updateActuatorName,
} from '../../actions/actions.js';
import gatewayImage from '../../images/gateway.png';
import config from '../../config';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

class GatewayDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { modalLocation: false };
  }

  componentWillMount() {
    this.props.getGateways();
    this.interval = setInterval(() => {
      this.props.getGateways();
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
        Gateway view is being loaded...
        {' '}
      </h1>
    );
    console.log(`sens:${JSON.stringify(this.props.gateway)}`);
    const gateway = this.props.gateway;
    console.log(gateway);
    if (gateway) {
      const position = gateway.location ? [
        gateway.location.latitude, gateway.location.longitude,
      ] : [
        12.238, -1.561,
      ];
      console.log(`pos:${JSON.stringify(position)}`);
      renderElement = (
        <Container fluid>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={gatewayImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Gateway Details    
            </Typography>
          </Toolbar>
        </AppBar>
          <GatewayNodeCard
            className="gatewayNode"
            deleteSensor={this.props.deleteSensor}
            deleteActuator={this.props.deleteActuator}
            deleteGateway={(sid) => {
              this.props.deleteGateway(sid); browserHistory.push('/gateways');
            }}
            permission={this.props.permission}
            gateway={gateway}
            updateSensor={this.props.addSensor}
            updateActuator={this.props.addActuator}
            user={this.props.user}
          />
        </Container>
      );
    } else {
      browserHistory.push('/gateways');
    }

    return (
      <div className="gateway">
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    gateway : state.gateways ? state.gateways.gateways.find(g => g.id == ownProps.params.gatewayId) : null,
    permission: state.permissions.gateway.find(p => p.resource == ownProps.params.gatewayId),
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getGateways: (id) => {
      dispatch(getGateways(id));
    },
    addSensor: (id, m) => {
      dispatch(addSensor(id, m));
    },
    deleteSensor: (sid, mid) => {
      dispatch(deleteSensor(sid, mid));
    },
    addActuator: (id, m) => {
      dispatch(addActuator(id, m));
    },
    deleteActuator: (aid, mid) => {
      dispatch(deleteActuator(aid, mid));
    },
    deleteGateway: (id) => {
      dispatch(deleteGateway(id));
    },
    updateSensorName: (gatewayId, sensId, n) => {
      dispatch(updateSensorName(gatewayId, sensId, n));
    },
    updateActuatorName: (gatewayId, actuId, n) => {
      dispatch(updateActuatorName(gatewayId, actuId, n));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GatewayDetail);
