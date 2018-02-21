import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import SensorNodeCard from './SensorNodeCard';
import LocationForm from './LocationForm';
import MeasurementForm from './MeasurementForm';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getValues, getSensors } from "../../../actions/actions.js"
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';


class MeasurementDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalLocation: false,
    };
  }
  
  componentDidMount() {
    this.interval = setInterval(() => {this.props.getValues(this.props.params.sensorId, this.props.params.measId)}, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillMount() {
    this.props.getValues(this.props.params.sensorId, this.props.params.measId)
    this.props.getSensors();
  }
  
  render() {
    console.log("meas:" + JSON.stringify(this.props.meas))
    console.log("values:" + JSON.stringify(this.props.values))
    return (
      <Container fluid={true}>
        <h1 className="page-title">Measurement: {this.props.meas.id}</h1>
        <Card>
          <CardTitle>
            <h2 className="sensorNodeTitle"> Graphic </h2>
          </CardTitle>
          <CardMedia>
            <SensorChart meas={this.props.meas} values={this.props.values}/>
          </CardMedia>
        </Card>
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
  try {
  var sensor = state.sensors.sensors.find(s => s.id === ownProps.params.sensorId)
  var meas = sensor? sensor.measurements.find(m => m.id == ownProps.params.measId): null
  return {
    meas: meas, 
    user: state.keycloak.idTokenParsed,
    values: state.values.values 
  }
  } catch(error) {
    console.log(JSON.stringify(error))
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getValues: (sid, mid) => {dispatch(getValues(sid, mid)) },
    getSensors: () => {dispatch(getSensors()) },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementDetail);
