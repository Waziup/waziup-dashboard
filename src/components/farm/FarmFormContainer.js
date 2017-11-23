import { connect } from 'react-redux';
import FarmForm from './FarmForm.js';
import { updateSensorStart } from '../../actions/actions';

function mapStateToProps(state) {
    return {
        permissions: state.keycloak.idTokenParsed.permissions,
        allSps: state.sensors.allSps
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateSensorStart: (sensor) => { dispatch(updateSensorStart(sensor)) }
    }
}
const FarmFormContainer = connect(mapStateToProps, mapDispatchToProps)(FarmForm);
export default FarmFormContainer;