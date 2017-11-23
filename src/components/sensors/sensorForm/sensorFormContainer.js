import { connect } from 'react-redux';
import sensorForm from './sensorForm.js';
import { updateSensorStart } from '../../../actions/actions';

function mapDispatchToProps(dispatch) {
    return {
      updateSensorStart: (sensor) => {dispatch(updateSensorStart(sensor))}
    }
}
const sensorFormContainer = connect(mapDispatchToProps)(sensorForm);
export default sensorFormContainer;
