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

class DomainNameComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let maxlimit = 20;
    return this.props.domain ? (
      <div>
        <Hidden mdUp implementation="css">
          <h2>
            {" "}
            Domain{" "}
            {this.props.domain.length > maxlimit
              ? this.props.domain.substring(0, maxlimit - 3) + "..."
              : this.props.domain}{" "}
          </h2>
        </Hidden>
        <Hidden smDown implementation="css">
          <h2> Domain {this.props.domain} </h2>
        </Hidden>
      </div>
    ) : (
      ""
    );
  }
}

class Gateways extends Component {
  constructor(props) {
    super(props);
    this.state = { modalAddGateway: false, modalEditGateway: false };
  }

  componentDidMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
  }

  //returns a structure with devices sorted by gateways, and gateways sorted by domains
  getDomains = () => {
    var domains = [];
    var domainNames = [...new Set(this.props.devices.map(s => s.domain))];
    console.log("domainNames" + JSON.stringify(domainNames));

    for (var domain of domainNames) {
      let devices = this.props.devices.filter(
        s => s.domain == domain && s.gateway_id
      );
      var gatewayIDs = [...new Set(devices.map(s => s.gateway_id))];
      console.log("gateways" + JSON.stringify(gatewayIDs));
      var gateways = gatewayIDs.map(g => {
        return {
          gatewayID: g,
          devices: devices.filter(s => s.gateway_id == g)
        };
      });
      domains.push({ domainName: domain, gateways: gateways });
    }
    console.log("domains" + JSON.stringify(domains));
    return domains;
  };

  render() {
    return (
      <Container fluid={true} style={{ paddingBottom: "100px" }}>
        <AppBar
          position="static"
          style={{ marginBottom: "30px", background: "#e9edf2" }}
        >
          <Toolbar>
            <img src={gatewayImage} height="50" />
            <Typography variant="h5" className="page-title">
              Gateways
            </Typography>
          </Toolbar>
        </AppBar>
        <AddGatewayForm modalOpen={this.state.modalAddGateway}
                        handleClose={() => this.setState({ modalAddGateway: false })}
                        onSubmit={gateway => {this.props.createGateway(gateway);}}/>
        {this.props.settings.displayCreators?
          <Button variant="contained"
                  color="primary"
                  onTouchTap={() => this.setState({ modalAddGateway: true })}>
            Add a gateway
          </Button> : null}
        {this.props.gateways.length ? (
          <div style={{ marginTop: "20px" }}>
            {this.props.gateways
              ? this.props.gateways.map((gateway, index) => {
                  return (
                    <Link to={"/gateways/" + gateway.id}>
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
        ) : (
          ""
        )}
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
    settings: state.settings
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
