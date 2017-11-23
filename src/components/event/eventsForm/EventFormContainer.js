import { connect } from 'react-redux';
import EventForm from './EventForm.js';

function mapStateToProps(state) {
    return {
        sensor: state.sensor.sensor,
        farm: state.farm.farm
    }
}

const EventFormContainer = connect(mapStateToProps)(EventForm);
export default EventFormContainer;