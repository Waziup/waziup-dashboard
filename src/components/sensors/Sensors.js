import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system';
import SensorForm from './sensor/SensorForm.js';
import SensorsTable from './SensorsTable.js';
import SensorsList from './SensorsList.js';
import {
  createSensor, getSensors, getSensorAttributes
} from '../../actions/actions.js';
import sensorNodesImage from '../../images/sensorNodes.png';
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

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.filterQuery = `owner==${props.user.username};`,
    this.state = {
      open: false,
      modalAddSensor: false,
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
    this.props.getSensors({ q: this.filterQuery, limit: 1000 });
    this.props.getSensorAttributes({ limit: 1000 });
    this.interval = setInterval(() => {
      this.props.getSensors({ q: this.filterQuery, limit: 1000 });
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
        this.props.getSensors({ limit: 1000, q: this.filterQuery });
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
      this.props.getSensors({ limit: 1000 });
    }
    else {
      this.props.getSensors({ q: this.filterQuery, limit: 1000 });
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
            src={sensorNodesImage}
          />
          Sensor nodes
        </h1>
        <SensorForm
          handleClose={() => this.setState({ modalAddSensor: false })}
          modalOpen={this.state.modalAddSensor}
          onSubmit={s => this.props.createSensor(s)}
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
                  title="Domain of the sensor">
                  <MenuItem value="all">All</MenuItem>
                  {this.props.sensorAttributes.domains ? this.props.sensorAttributes.domains.sort(this.compare).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>) : null}
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
                  title="Owner of the sensor">
                  <MenuItem value="all">All</MenuItem>
                  {this.props.sensorAttributes.owners ? this.props.sensorAttributes.owners.sort(this.compare).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>) : null}
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
                  title="Public visibility of the sensor">
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
                  title="Status of the sensor">
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
            <SensorsList
              addSensor={() => {
                console.log('test'); this.setState({ modalAddSensor: true });
              }}
              sensors={this.props.sensors}
              user={this.props.user}
            />
          )
          : <SensorsTable sensors={this.props.sensors} />}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    sensorAttributes: state.sensorAttributes.sensorAttributes,
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createSensor: (sensor) => {
      dispatch(createSensor(sensor));
    },
    getSensors: (params) => {
      dispatch(getSensors(params));
    },
    getSensorAttributes: (params) => {
      dispatch(getSensorAttributes(params));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Sensors));
