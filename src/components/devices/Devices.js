import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import DeviceForm from './device/DeviceForm.js';
import DeviceLineCard from './DeviceLineCard.js';
import {
  createDevice, getDevices, getDeviceAttributes
} from '../../actions/actions.js';
import config from '../../config';
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
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import deviceImage from '../../images/device.png';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router';
import { ListLoader } from './../Loaders';
import HelpIcon from '@material-ui/icons/Help';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class Devices extends Component {

  interval = null;

  constructor(props) {
    super(props);
    let defaultFilter = {
      domain: 'all',
      owner: props.user.username,
      visibility: 'all',
      status: 'all'
    }
    this.state = {
      open: false,
      modalAddDevice: false,
      filter: defaultFilter,
      devices: props.devices.filter(dev => this.isFilteredDevice(dev, defaultFilter))
    };

  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  componentWillMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getDeviceAttributes({ limit: 1000 });
    this.interval = setInterval(() => {
      this.props.getDevices({ limit: 1000 });
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  componentWillReceiveProps(nextProps) { 
    this.setState({devices: nextProps.devices.filter(dev => this.isFilteredDevice(dev, this.state.filter))})
  }

  compare(a, b) {
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  }

  handleFilter = (field, event) => {

    const value = event.target.value;
    var filter = this.state.filter;
    switch (field) {
      case "domain":
        {
          filter.domain = value;
          break;
        }
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
      case "status":
        {
          filter.status = value;
          break;
        }
    }
    this.setState({ filter: filter })
    //re-filter the devices
    this.setState({ devices: this.props.devices.filter(dev => this.isFilteredDevice(dev, filter))})
  }


  isFilteredDevice = (device, filter) => {
    
    // Check the domain
    if (filter.domain && filter.domain != 'all' && filter.domain != device.domain) {
      return false;
    }
    // Check the owner
    if (filter.owner && filter.owner != 'all' && filter.owner != device.owner) {
      return false;
    }
    // Check the visibility
    if (filter.visibility && filter.visibility != 'all' && filter.visibility != device.visibility) {
      return false;
    }
    // check new status
    var yesterday = new Date(Date.now() - config.delayDeviceNew).toISOString();
    if (filter.status == 'new' && device.date_created < yesterday) {
      return false;
    }
    // check active status
    var yesterday = new Date(Date.now() - config.delayDeviceActive).toISOString();
    if (filter.status == 'active' && device.date_modified < yesterday) {
      return false;
    }

    //all checks passed, device is OK
    return true;
  }

  render() {
    const { classes } = this.props;

    return (
      <Container fluid>
        <AppBar position="static"
                style={{marginBottom: '30px', background: '#e9edf2'}}>
          <Toolbar>
            <img src={deviceImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Devices       
            </Typography>
            <a style={{marginLeft: 'auto'}} href={config.docServerUrl + "/#devices"} target="_blank">
              <HelpIcon />
            </a>
          </Toolbar>
        </AppBar>
        <DeviceForm gateways={this.props.gateways}
                    handleClose={() => this.setState({ modalAddDevice: false })}
                    modalOpen={this.state.modalAddDevice}
                    onSubmit={s => this.props.createDevice(s)}/>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>
            <FilterList />
          </ListItemIcon>
          <ListItemText inset primary="Filters" />
          {this.state.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <Grid container spacing={24}>
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="domain">Domain</InputLabel>
                <Select title="Domain of the device"
                        input={<Input name="domain" id="domain"
                                      value={this.state.filter.domain}
                                      onChange={(d) => this.handleFilter("domain", d)}/>}>
                  <MenuItem value="all">
                    All
                  </MenuItem>
                  {this.props.deviceAttributes.domains ? this.props.deviceAttributes.domains.sort(this.compare).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>):''}
                </Select>
              </FormControl>
            </Grid>
            {this.props.settings.showPublicResources ? 
              <Grid item sm={6} md={4} lg={3}>
                <FormControl fullWidth className={classes.formControl}>
                  <InputLabel htmlFor="owner">Owner</InputLabel>
                  <Select title="Owner of the device"
                          input={<Input name="owner"
                                        id="owner"
                                        value={this.state.filter.owner}
                                        onChange={(a) => this.handleFilter("owner", a)} />}>
                    <MenuItem value="all">
                      All
                    </MenuItem>
                    {this.props.deviceAttributes.owners ? this.props.deviceAttributes.owners.sort(this.compare).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>):''}
                  </Select>
                </FormControl>
              </Grid>
            : null }
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="visibility">Visibility</InputLabel>
                <Select title="Public visibility of the device"
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
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select title="Status of the device"
                        input={<Input name="status" id="status"
                                      value={this.state.filter.status}
                                      onChange={(s) => this.handleFilter("status", s)} />}>
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
        {this.props.settings.allowManualCreateResources ? 
          <Button variant="contained"
                  color="primary"
                  className="addDeviceButton"
                  onTouchTap={() => this.setState({ modalAddDevice: true })} >
            Add a device
          </Button>
        : null}
        <div className="section">
          <div style={{ marginTop: "20px" }}>
            {this.props.devices.length == 0 ?
              //Show a loader when the unfiltered device list is empty.
              ListLoader()
            : this.state.devices.length == 0 ? 
              <h3> No devices to be displayed. </h3>
            : this.state.devices.map(s => {return (
              <Link key={s.id} to={"/devices/" + s.id}>
                {this.props.settings.showPublicResources ? 
                  <DeviceLineCard className="deviceNode"
                                  device={s}
                                  user={this.props.user}/>
                : (s.owner == this.props.user.username) 
                    && <DeviceLineCard className="deviceNode"
                                       device={s}
                                       user={this.props.user}/>}
              </Link>)})
            }
          </div>
        </div>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.devices.devices,
    gateways: state.settings.showPublicResources ? state.gateways.gateways : state.gateways.gateways.filter(d => d.owner == state.current_user.username),
    deviceAttributes: state.deviceAttributes.deviceAttributes,
    user: state.current_user,
    settings: state.settings
  };
}

const mapDispatchToProps= {
  createDevice,
  getDevices,
  getDeviceAttributes
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Devices));
