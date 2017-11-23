import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';
import { loadSensors } from "../../../api-adapter.js"

function mapStateToProps(state) {
    return {
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadSensors: (isAllSensors, user) => {dispatch(loadSensors(isAllSensors, user)) },
    }
}
const sensorDetailContainer = connect(mapStateToProps, mapDispatchToProps)(sensorDetail);
export default sensorDetailContainer;
