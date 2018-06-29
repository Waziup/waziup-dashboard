import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import { connect } from 'react-redux';
import GatewayNetwork from './GatewayNetwork.js'
import { Container } from 'react-grid-system'
import Utils from '../../lib/utils';
import { getSensors, updateSensorGatewayId} from "../../actions/actions.js"
import * as Waziup from 'waziup-js'
import { Link } from 'react-router';
import gatewayImage from '../../images/RPIs.png';

class Gateways extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  componentDidMount() {
    this.props.getSensors();
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
        {React.DOM.div(null, 
          this.getDomains().map(d => [ 
            React.DOM.h2({className: "sectionTitle"}, "Domain " + d.domainName),
            d.gateways.map(g => React.createElement(GatewayNetwork, {gateway: g, domainName: d.domainName, updateSensorGatewayId: this.props.updateSensorGatewayId})) 
          ])
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: () => {dispatch(getSensors()) },
    updateSensorGatewayId: (sid, gid) => {dispatch(updateSensorGatewayId(sid, gid)) }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Gateways);
