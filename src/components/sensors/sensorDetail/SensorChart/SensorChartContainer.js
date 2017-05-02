import { connect } from 'react-redux';
import SensorChart from './SensorChart.js';
import { getHistoData } from '../../../../actions/actions';


function mapStateToProps(state) {
  return {
    historical:state.historical.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getHistoData:(sensor,measurement)=>{dispatch(getHistoData(sensor,measurement))}
  }
}
const SensorChartContainer = connect( mapStateToProps,mapDispatchToProps)(SensorChart);
export default SensorChartContainer;
