import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import GatewayNodeCard from './GatewayNodeCard'
import {
  deleteGateway, getGateway, updateGatewayName,
  getGatewayPermissions, updateGatewayLocation
} from '../../actions/actions.js';
import gatewayImage from '../../images/gateway.png';
import Hidden from '@material-ui/core/Hidden';
import EditIcon from '@material-ui/icons/Edit';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { GatewayLoader } from './../Loaders';
import config from '../../config';
import QRCode from 'qrcode.react';
import Card from '@material-ui/core/Card';
import LocationForm from '../LocationForm';
import Button from '@material-ui/core/Button';
import {
  Map, Marker, Popup, TileLayer,
} from 'react-leaflet';

class GatewayDetail extends Component {

  interval = null;

  constructor(props) {
    super(props);
    this.state = { 
      modalLocation: false,
      loading: true 
    };
  }

  componentWillMount() {
    this.props.getGateway(this.props.params.gatewayId);
    this.props.getGatewayPermissions();
    this.interval = setInterval(() => {
      this.props.getGateway(this.props.params.gatewayId);
      this.props.getGatewayPermissions();
    }, config.delayRefresh);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.gateway !== this.props.gateway){
      this.setState({ loading: false })
    }
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
          { this.state.loading
             ? GatewayLoader()
             : ( <div>
                   <GatewayNodeCard className="gatewayNode"
                                    deleteGateway={(sid) => {
                                      this.props.deleteGateway(sid); browserHistory.push('/gateways');
                                    }}
                                    updateGatewayName={this.props.updateGatewayName}
                                    permission={this.props.permission}
                                    gateway={gateway}/>
                   <Card className="deviceMap">
                     <span className="Typography">
                       {' '}
                       Location
                       {' '}
                     </span>
                     {this.props.permission && this.props.permission.scopes.includes('gateways:update')
                       ? 
                       (<div className="cardTitleIcons">
                         <Hidden mdUp implementation="css">
                           <EditIcon onClick={() => { this.setState({ modalLocation: true }); }} />
                         </Hidden>
                         <Hidden smDown implementation="css">
                         <Button className="topRightButton" onTouchTap={() => { this.setState({ modalLocation: true }); }} variant="contained" color="primary" >Change</Button>
                         </Hidden>
                       </div>) : null}
                     <LocationForm handleClose={() => this.setState({ modalLocation: false })}
                                   initialLocation={gateway.location}
                                   modalOpen={this.state.modalLocation}
                                   onSubmit={l => {this.props.updateGatewayLocation(gateway.id, l)}}
                                   permission={this.props.permission}/>
                     <Map ref="map"
                          center={position}
                          zoom={5}>
                       <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="http://{s}.tile.osm.org/{z}/{x}/{y}.png" />
                       {gateway.location? 
                         <Marker position={position}>
                           <Popup>
                             <span>
                               Gateway Position
                               <br />
                               {' '}
                               Latitude:
                               {position[0]}
                               {' '}
                               <br />
                               {' '}
                               Longitude:
                               {' '}
                               {position[1]}
                             </span>
                           </Popup>
                         </Marker>
                       :null}
                     </Map>
                   </Card>
                 </div>
              )
          }
          <Card className="QRCode">
            <span className="Typography">
              {' '}
              Gateway QR code
              {' '}
            </span>
            <div style={{cursor: 'pointer'}}>
              <a onClick={() => downloadQR(document.getElementById("QRCodeId"), 
                                           'Gateway Id:', 
                                           this.props.gateway.id)}>
                <QRCode id="QRCodeId"
                        value={window.location.href}
                        size={250}
                        level={"L"}
                        includeMargin={true}/>
                <h3> Download me, print me <br/>and stick me on your gateways! </h3>
              </a>
            </div>
          </Card>
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
    gateway: state.gateway.gateway,
    permission: state.permissions.gateway.find(p => p.resource == ownProps.params.gatewayId),
    user: state.current_user,
  };
}

const mapDispatchToProps = {
  getGateway,
  getGatewayPermissions,
  deleteGateway,
  updateGatewayName,
  updateGatewayLocation
}

export default connect(mapStateToProps, mapDispatchToProps)(GatewayDetail);
