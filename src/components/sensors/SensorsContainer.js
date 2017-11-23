import { connect } from 'react-redux';
import Sensors from './Sensors.js';
import { updateSensorSuccess } from '../../actions/actions';
import { createSensor, loadSensors, deleteSensor, updateSensorLocation, updateSensorOwner } from '../../api-adapter';

function mapStateToProps(state) {
  return {
    sensors: state.sensors.sensors,
    isLoading: state.sensors.isLoading,
    user: state.keycloak.idTokenParsed
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSensorSuccess: (sensor) => { dispatch(updateSensorSuccess(sensor)) },
    createSensor: (sensorId, sensorType, sensorLon, sensorLat, user) => {dispatch(createSensor(sensorId, sensorType, sensorLon, sensorLat, user)) }, 
    loadSensors: (isAllSensors, user) => {dispatch(loadSensors(isAllSensors, user)) },
    deleteSensor: (sensorId, servicePath, user) => {dispatch(deleteSensor(sensorId, servicePath, user)) },
    updateSensorLocation: (sensorId, sensorLon, sensorLat, servicePath, user) => {dispatch(updateSensorLocation(sensorId, sensorLon, sensorLat, servicePath, user)) },
    updateSensorOwner: (sensorId, servicePath, user) => {dispatch(updateSensorOwner(sensorId, servicePath, user)) }
  };
}
const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
export default SensorsContainer;
