import { connect } from 'react-redux';
import SensorChart from './SensorChart.js';

function mapStateToProps(state) {
  return {
    historical:state.historical.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}
const SensorChartContainer = connect( mapStateToProps,mapDispatchToProps)(SensorChart);
export default SensorChartContainer;
