import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';
import { getSensors } from "../../../actions/actions.js"

function mapStateToProps(state) {
    return {
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getSensors: () => {dispatch(getSensors()) }
  };
}

const sensorDetailContainer = connect(mapStateToProps, mapDispatchToProps)(sensorDetail);
export default sensorDetailContainer;
