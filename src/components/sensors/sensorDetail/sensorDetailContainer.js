import { connect } from 'react-redux';
import sensorDetail from './sensorDetail.js';
import { fetchSensors } from "../../../actions/actions.js"

function mapStateToProps(state) {
    return {
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed
    }
}

const sensorDetailContainer = connect(mapStateToProps)(sensorDetail);
export default sensorDetailContainer;
