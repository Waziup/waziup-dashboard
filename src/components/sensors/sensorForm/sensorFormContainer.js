import { connect } from 'react-redux';
import sensorForm from './sensorForm.js';
import { updateSensorStart } from '../../../actions/actions';

function mapDispatchToProps(dispatch) {
    return {
    }
}
const sensorFormContainer = connect(mapDispatchToProps)(sensorForm);
export default sensorFormContainer;
