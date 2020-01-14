import React, { Component } from "react";
import { connect } from "react-redux";
import GatewayNetwork from "./GatewayNetwork.js";
import { Container } from "react-grid-system";
import {
  getDevices,
  createGateway,
  updateGateway,
  deleteGateway,
  getGateways
} from "../../actions/actions.js";
import gatewayImage from "../../images/gateway.png";
import Hidden from "@material-ui/core/Hidden";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddGatewayForm from "./AddGatewayForm.js";
import { Link } from "react-router";
import GatewayLineCard from "./GatewayLineCard";
import Card from "@material-ui/core/Card";
import config from '../../config';
import { ListLoader } from './../Loaders';
import HelpIcon from '@material-ui/icons/Help';

class Gateways extends Component {
  
  interval = 0;
  
  constructor(props) {
    super(props);
    this.state = { 
      modalAddGateway: false,
      modalEditGateway: false,
      loading: true };
  }

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.interval = setInterval(() => {
      this.props.getDevices({ limit: 1000 });
      this.props.getGateways();
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps() { 
    this.setState({loading: false})
  }

  render() {
    return (
      <Container fluid={true} style={{ paddingBottom: "100px" }}>
        <AppBar position="static"
                style={{ marginBottom: "30px", background: "#e9edf2" }}>
          <Toolbar>
            <img src={gatewayImage} height="50" />
            <Typography variant="h5" className="page-title">
              Gateways
            </Typography>
            <a style={{marginLeft: 'auto'}} href={config.docServerUrl + "/#gateways"} target="_blank">
              <HelpIcon />
            </a>
          </Toolbar>
        </AppBar>
        <AddGatewayForm modalOpen={this.state.modalAddGateway}
                        handleClose={() => this.setState({ modalAddGateway: false })}
                        onSubmit={gateway => {this.props.createGateway(gateway);}}/>
        {this.props.settings.allowManualCreateResources?
          <Button variant="contained"
                  color="primary"
                  className="addDeviceButton"
                  onTouchTap={() => this.setState({ modalAddGateway: true })}>
            Add a gateway
          </Button> : null}
        {this.props.gateways && this.props.gateways.length ?
          <div style={{ marginTop: "20px" }}>
            { this.state.loading ? 
              ListLoader()
              :this.props.gateways
              ? this.props.gateways.map((gateway, index) => {
                  return (
                    this.props.settings.showPublicResources ?
                    <Link to={"/gateways/" + gateway.id}>
                      <GatewayLineCard gateway={gateway}
                                       isDetails={true}
                                       updateGateway={this.props.createGateway}
                                       deleteGateway={this.props.deleteGateway}
                                       permission={this.props.gatewayPermissions.find(
                                         p => p.resource == gateway.id
                                       )}/>
                    </Link>
                    : (gateway.owner ==  this.props.user.username)
                      && <Link to={"/gateways/" + gateway.id}>
                      <GatewayLineCard gateway={gateway}
                                      isDetails={true}
                                      updateGateway={this.props.createGateway}
                                      deleteGateway={this.props.deleteGateway}
                                      permission={this.props.gatewayPermissions.find(
                                        p => p.resource == gateway.id
                                      )}/>
                      </Link>
                  );
                })
              : null}
          </div>
        : null}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.devices.devices,
    gateways: state.gateways.gateways,
    devicePermissions: state.permissions.device,
    gatewayPermissions: state.permissions.gateway,
    settings: state.settings,
    user: state.current_user,
  };
}

const mapDispatchToProps = {
  getDevices,
  getGateways,
  createGateway,
  deleteGateway
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gateways);
