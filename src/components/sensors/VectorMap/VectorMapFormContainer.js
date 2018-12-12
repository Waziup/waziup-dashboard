import { connect } from 'react-redux';
import VectorMapForm from './VectorMapForm.js';
import { updateSensorStart } from '../../../actions/actions';
// Import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
  return {
    permissions: state.keycloak.idTokenParsed.permissions,
    allSps: state.sensors.allSps,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSensorStart: (sensor) => {
      dispatch(updateSensorStart(sensor));
    },
  };
}
const VectorMapFormContainer = connect(mapStateToProps, mapDispatchToProps)(VectorMapForm);
export default VectorMapFormContainer;
