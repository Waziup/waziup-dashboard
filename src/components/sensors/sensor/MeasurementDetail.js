import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import SensorChart from './SensorChart';
import SensorNodeCard from './SensorNodeCard';
import LocationForm from './LocationForm';
import MeasurementForm from './MeasurementForm';
import MeasurementCard from './MeasurementCard';
import UTIL from '../../../lib/utils.js';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { getValues, getSensors, addMeasurement, deleteMeasurement } from "../../../actions/actions.js"
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
    this.interval = setInterval(() => {this.fetchValues()}, 10000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillMount() {
    this.fetchValues()
  }

  fetchValues = () => {
    this.props.getValues(this.props.params.sensorId, this.props.params.measId)
    this.props.getSensors();
  }
  
  render() {
    console.log("meas:" + JSON.stringify(this.props.meas))
    console.log("values:" + JSON.stringify(this.props.values))
    if (this.props.meas) {

      return (
        <Container fluid={true}>
          <h1 className="page-title">Measurement: {this.props.meas.id}</h1>
          <MeasurementCard measurement={this.props.meas} isEditable={true} updateMeasurement={this.props.updateMeasurement} 
                           deleteMeasurement={this.props.deleteMeasurement} sensorId={this.props.sensorId}/>
          <Card className="graphCard">
            <CardTitle>
              <h2 className="sensorNodeTitle"> Historical chart </h2>
            </CardTitle>
            <CardMedia>
              <SensorChart meas={this.props.meas} values={this.props.values}/>
            </CardMedia>
          </Card>
        </Container>
      );
    } else {
      return(<h1> Measurement view is being loaded... </h1>)
    }
  }
}

function mapStateToProps(state, ownProps) {
  var sensor = state.sensors.sensors.find(s => s.id === ownProps.params.sensorId)
  var meas = sensor? sensor.measurements.find(m => m.id == ownProps.params.measId): null
  return {
    sensorId: sensor? sensor.id: null,
    meas: meas, 
    user: state.keycloak.idTokenParsed,
    values: state.values.values 
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getValues: (sid, mid) => {dispatch(getValues(sid, mid)) },
    getSensors: () => {dispatch(getSensors()) },
    updateMeasurement: (id, m) => {dispatch(addMeasurement(id, m)) },
    deleteMeasurement: (sid, mid) => {dispatch(deleteMeasurement(sid, mid)) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementDetail);
