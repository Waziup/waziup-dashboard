import { connect } from 'react-redux';
import Sensors from './Sensors.js';
import { createSensor, getSensors, deleteSensor, updateSensorLocation, updateSensorOwner } from '../../actions/actions.js';

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
    createSensor: (sensor) => {dispatch(createSensor(sensor)) }, 
    getSensors: () => {dispatch(getSensors()) },
    deleteSensor: (sensorId) => {dispatch(deleteSensor(sensorId)) },
    updateSensorLocation: (sensorId, location) => {dispatch(updateSensorLocation(sensorId, location)) },
    updateSensorOwner: (sensorId, owner) => {dispatch(updateSensorOwner(sensorId, owner)) }
  };
}
const SensorsContainer = connect(mapStateToProps, mapDispatchToProps)(Sensors);
export default SensorsContainer;
