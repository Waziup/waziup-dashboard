import { connect } from 'react-redux';
import EventForm from './EventForm.js';

function mapStateToProps(state) {
    return {
        sensor: state.sensor
    }
}

const EventFormContainer = connect(mapStateToProps)(EventForm);
export default EventFormContainer;
