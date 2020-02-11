import React, { Component } from "react";
import { connect } from "react-redux";
import GatewayNetwork from "./GatewayNetwork.js";
import { Container } from "react-grid-system";
import {
  getDevices,
  createGateway,
  updateGateway,
  deleteGateway,
  getGateways,
  getGatewayAttributes
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
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import FilterList from '@material-ui/icons/FilterList';

class Gateways extends Component {
  
  interval = 0;
  
  constructor(props) {
    super(props);
    let defaultFilter = {
      owner: props.user.username,
      visibility: 'all',
      connected: 'all'
    }
    this.state = { 
      open: false,
      modalAddGateway: false,
      modalEditGateway: false,
      loading: true,
      filter: defaultFilter,
      gateways: props.gateways.filter(gw => this.isFilteredGateway(gw, defaultFilter))
    };
  }

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGatewayAttributes();
    this.props.getGateways();
    this.interval = setInterval(() => {
      this.props.getDevices({ limit: 1000 });
      this.props.getGateways();
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) { 
    this.setState({loading: false})
    this.setState({gateways: nextProps.gateways.filter(gw => this.isFilteredGateway(gw, this.state.filter))})
  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleFilter = (field, event) => {

    const value = event.target.value;
    var filter = this.state.filter;
    switch (field) {
      case "owner":
        {
          filter.owner = value;
          break;
        }
      case "visibility":
        {
          filter.visibility = value;
          break;
        }
      case "connected":
        {
          filter.connected = value;
          break;
        }
    }
    this.setState({ filter: filter })
    //re-filter the devices
    this.setState({ gateways: this.props.gateways.filter(gw => this.isFilteredGateway(gw, filter))})
  }

  //check if gateway is acceptable for filters (return true if we keep the gateway)
  isFilteredGateway = (gateway, filter) => {
    
    // Check the owner
    if (filter.owner && filter.owner != 'all' && filter.owner != gateway.owner) {
      return false;
    }
    // Check the visibility
    if (filter.visibility && filter.visibility != 'all' && filter.visibility != gateway.visibility) {
      return false;
    }
    // check connected
    if (filter.connected && filter.connected != 'all') {
      if(!gateway.hasOwnProperty('connected')) {
        return false;
      }
      if(filter.connected == 'connected' && gateway.connected == false) {
        return false;
      }
      if(filter.connected == 'disconnected' && gateway.connected == true) {
        return false;
      }
    }

    //all checks passed, gateway is OK
    return true;
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
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <FilterList />
          </ListItemIcon>
          <ListItemText inset primary="Filters" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <Grid container spacing={24}>
            {this.props.settings.showPublicResources ? 
              <Grid item sm={6} md={4} lg={3}>
                <FormControl fullWidth className={this.props.formControl}>
                  <InputLabel htmlFor="owner">Owner</InputLabel>
                  <Select title="Owner of the gateway"
                          input={<Input name="owner" id="owner"
                                        value={this.state.filter.owner}
                                        onChange={(a) => this.handleFilter("owner", a)} />}>
                    <MenuItem value="all">
                      All
                    </MenuItem>
                    {this.props.gatewayAttributes.owners ? this.props.gatewayAttributes.owners.sort(this.compare).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>):''}
                  </Select>
                </FormControl>
              </Grid>
            : null }
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={this.props.formControl}>
                <InputLabel htmlFor="visibility">Visibility</InputLabel>
                <Select title="Public visibility of the gateway"
                        input={<Input name="visibility" id="visibility"
                                      value={this.state.filter.visibility}
                                      onChange={(v) => this.handleFilter("visibility", v)} />}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={this.props.formControl}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select title="Connected status of the gateway"
                        input={<Input name="status" id="status"
                                      value={this.state.filter.connected}
                                      onChange={(s) => this.handleFilter("connected", s)} />}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="connected">Connected</MenuItem>
                  <MenuItem value="disconnected">Not Connected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
        {this.props.settings.allowManualCreateResources?
          <Button variant="contained"
                  color="primary"
                  className="addDeviceButton"
                  onTouchTap={() => this.setState({ modalAddGateway: true })}>
            Add a gateway
          </Button> 
        : null}
        <div className="section">
          <div style={{ marginTop: "20px" }}>
            {this.props.gateways.length == 0 ? 
              ListLoader()
            : this.state.gateways.length == 0 ? 
              <h3> No gateways to be displayed. </h3>
            : this.state.gateways.map((gateway, index) => {
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
              )
            })}
          </div>
        </div>

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
    gatewayAttributes: state.gatewayAttributes.gatewayAttributes,
  };
}

const mapDispatchToProps = {
  getDevices,
  getGateways,
  createGateway,
  deleteGateway,
  getGatewayAttributes
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gateways);
