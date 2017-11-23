import { connect } from 'react-redux';
import SensorChart from './SensorChart.js';

function mapStateToProps(state) {
  return {
    keycloak: state.keycloak
  }
}

const SensorChartContainer = connect(mapStateToProps)(SensorChart);
export default SensorChartContainer;
