import React, { Component } from 'react';
import { connect } from 'react-redux';
import GatewayNetwork from './GatewayNetwork.js'
import { Container } from 'react-grid-system';
import { getSensors, updateSensorGatewayId} from "../../actions/actions.js";
import gatewayImage from '../../images/RPIs.png';
import DOM from 'react-dom-factories';
import Hidden from '@material-ui/core/Hidden';

class DomainNameComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    let maxlimit = 20;
    return (
      <div>
        <Hidden mdUp implementation="css">
          <h2> Domain {((this.props.domain).length > maxlimit) ? (((this.props.domain).substring(0, maxlimit - 3)) + '...') : this.props.domain} </h2>
        </Hidden>
        <Hidden smDown implementation="css">
          <h2 > Domain {this.props.domain} </h2>
        </Hidden>
      </div>
    )
  }
}

class Gateways extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
    this.props.getSensors({limit: 1000});
  }

  //returns a structure with sensors sorted by gateways, and gateways sorted by domains
  getDomains = () => {
    var domains = []
    var domainNames = [...new Set(this.props.sensors.map(s => s.domain))]
    console.log("domainNames"+ JSON.stringify(domainNames))

    for(var domain of domainNames) {
      let sensors = this.props.sensors.filter(s => s.domain == domain && s.gateway_id)
      var gatewayIDs = [...new Set(sensors.map(s => s.gateway_id))]
      console.log("gateways"+ JSON.stringify(gatewayIDs))
      var gateways = gatewayIDs.map(g => {return {gatewayID: g, sensors: sensors.filter(s => s.gateway_id == g)}})
      domains.push({domainName: domain, gateways: gateways})
    }
    console.log("domains"+ JSON.stringify(domains))
    return domains
  }

  render() {
    return (
      <Container fluid={true}>
        <h1 className="page-title">
          <img src={gatewayImage} height="80"/>
          Gateways
        </h1>
        {DOM.div(null, 
          this.getDomains().map((d,index) => [ 
            React.createElement(DomainNameComponent, { key: { index }, domain:d.domainName}),
            d.gateways.map((g,index2) => React.createElement(GatewayNetwork, {gateway: g, domainName: d.domainName, updateSensorGatewayId: this.props.updateSensorGatewayId, permissions: this.props.permissions, key: (index+index2)})) 
          ])
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    permissions: state.permissions.permissions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: (params) => {dispatch(getSensors(params)) },
    updateSensorGatewayId: (sid, gid) => {dispatch(updateSensorGatewayId(sid, gid)) }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Gateways);
