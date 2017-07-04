import { connect } from 'react-redux';
import sensorForm from './sensorForm.js';
import { updateSensorStart } from '../../../actions/actions';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
      updateSensorStart:(sensor)=>{dispatch(updateSensorStart(sensor))}
    }
}
const sensorFormContainer = connect( mapStateToProps,mapDispatchToProps)(sensorForm);
export default sensorFormContainer;
