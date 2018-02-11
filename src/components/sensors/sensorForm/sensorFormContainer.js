import { connect } from 'react-redux';
import sensorForm from './sensorForm.js';

function mapDispatchToProps(dispatch) {
    return {
    }
}
const sensorFormContainer = connect(mapDispatchToProps)(sensorForm);
export default sensorFormContainer;
