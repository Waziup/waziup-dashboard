import { connect } from 'react-redux';
import Sensors from './Sensors.js';
import {updateSensorStart} from '../actions/actions';

function mapStateToProps(state) {
  return {
      sensors: state.sensors.sensors,
      isLoading:state.sensors.isLoading,
      user: state.keycloak.idTokenParsed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSensorStart:(sensor,servicePath)=>{dispatch(updateSensorStart(sensor,servicePath))},
  };
}
const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
export default SensorsContainer;
