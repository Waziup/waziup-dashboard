import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import DeviceForm from './device/DeviceForm.js';
import DevicesTable from './DevicesTable.js';
import DevicesList from './DevicesList.js';
import {
  createDevice, getDevices, getDeviceAttributes
} from '../../actions/actions.js';
import deviceNodesImage from '../../images/deviceNodes.png';
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
  constructor(props) {
    super(props);
    this.filterQuery = `owner==${props.user.username};`,
    this.state = {
      open: false,
      modalAddDevice: false,
      isCardsView: true,
      filter: {
        domain: 'all',
        owner: props.user.username,
        visibility: 'all',
        status: 'all'
      }
    };

  }

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  componentWillMount() {
    this.props.getDevices({ q: this.filterQuery, limit: 1000 });
    this.props.getDeviceAttributes({ limit: 1000 });
    this.interval = setInterval(() => {
      this.props.getDevices({ q: this.filterQuery, limit: 1000 });
    }, config.delayRefresh);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

  }

  compare(a, b) {
    if (a < b)
      return -1;
    if (a > b)
      return 1;
    return 0;
  }

  handleFilter = (field, event) => {

    if (!this.filterQuery) {
      clearInterval(this.interval);
      this.interval = setInterval(() => {
        this.props.getDevices({ limit: 1000, q: this.filterQuery });
      }, config.delayRefresh);
    }

    const value = event.target.value;
    var filter = this.state.filter;
    let statusFilter;
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
          var yesterday = new Date(Date.now() - 86400 * 1000).toISOString();
          if (value == 'all') {
            statusFilter = `dateModified>2000-01-01T00:00:00.00Z`
          }
          else if (value == 'new') {
            statusFilter = `dateCreated>${yesterday}`
          }
          else if (value == 'active') {
            statusFilter = `dateModified>${yesterday}`
          }
          break;
        }
    }
    this.filterQuery = ((filter.domain && filter.domain !== 'all') ? `domain==${filter.domain};` : '')
      + ((filter.owner && filter.owner !== 'all') ? `owner==${filter.owner};` : '') +
      ((filter.visibility && filter.visibility !== 'all') ? `visibility==${filter.visibility};` : '')
      + (statusFilter ? statusFilter : '');
    if (!(this.filterQuery).replace(/\s/g, '').length) {
      this.filterQuery = null;
      this.props.getDevices({ limit: 1000 });
    }
    else {
      this.props.getDevices({ q: this.filterQuery, limit: 1000 });
    }
    this.setState({ filter: filter })
  }

  render() {
    const { classes } = this.props;

    return (
      <Container fluid>
        <h1 className="page-title">
          <img
            height="40"
            src={deviceNodesImage}
          />
          Device nodes
        </h1>
        <DeviceForm
          handleClose={() => this.setState({ modalAddDevice: false })}
          modalOpen={this.state.modalAddDevice}
          onSubmit={s => this.props.createDevice(s)}
        />
        <pre
          className="tableSwitch"
          onClick={() => this.setState({ isCardsView: !this.state.isCardsView })}
        >
          {' '}
          {this.state.isCardsView ? 'Switch to table view' : 'Switch to cards view'}
          {' '}
        </pre>
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
                <Select
                  input={<Input name="domain" id="domain"
                    value={this.state.filter.domain} onChange={(d) => this.handleFilter("domain", d)}
                  />}
                  title="Domain of the device">
                  <MenuItem value="all">All</MenuItem>
                  {this.props.deviceAttributes.domains ? this.props.deviceAttributes.domains.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>):''}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="owner">Owner</InputLabel>
                <Select
                  input={<Input name="owner" id="owner"
                    value={this.state.filter.owner}
                    onChange={(a) => this.handleFilter("owner", a)} />}
                  title="Owner of the device">
                  <MenuItem value="all">All</MenuItem>
                  {this.props.deviceAttributes.owners ? this.props.deviceAttributes.owners.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>):''}
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="visibility">Visibility</InputLabel>
                <Select
                  input={<Input name="visibility" id="visibility"
                    value={this.state.filter.visibility}
                    onChange={(v) => this.handleFilter("visibility", v)} />}
                  title="Public visibility of the device">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item sm={6} md={4} lg={3}>
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  input={<Input name="status" id="status"
                    value={this.state.filter.status}
                    onChange={(s) => this.handleFilter("status", s)} />}
                  title="Status of the device">
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>

        {this.state.isCardsView
          ? (
            <DevicesList
              addDevice={() => {
                console.log('test'); this.setState({ modalAddDevice: true });
              }}
              devices={this.props.devices}
              user={this.props.user}
            />
          )
          : <DevicesTable devices={this.props.devices} />}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    devices: state.devices.devices,
    deviceAttributes: state.deviceAttributes.deviceAttributes,
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDevice: (device) => {
      dispatch(createDevice(device));
    },
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
    getDeviceAttributes: (params) => {
      dispatch(getDeviceAttributes(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Devices));
