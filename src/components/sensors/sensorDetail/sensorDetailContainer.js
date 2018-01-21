import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';
import { fetchSensors } from "../../../actions/actions.js"

function mapStateToProps(state) {
    return {
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed
    }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSensors: () => {dispatch(fetchSensors()) }
  };
}

const sensorDetailContainer = connect(mapStateToProps, mapDispatchToProps)(sensorDetail);
export default sensorDetailContainer;
