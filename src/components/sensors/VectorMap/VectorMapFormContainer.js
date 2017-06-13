import { connect } from 'react-redux';
import VectorMapForm from './VectorMapForm.js';
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
const VectorMapFormContainer = connect( mapStateToProps,mapDispatchToProps)(VectorMapForm);
export default VectorMapFormContainer;
