import { connect } from 'react-redux';
import EventForm from './EventForm.js';
import { createRecord } from '../../../actions/actions';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {
        sensor:state.sensor.sensor,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
const EventFormContainer = connect( mapStateToProps,mapDispatchToProps)(EventForm);
export default EventFormContainer;
