import { connect } from 'react-redux';
import Events from './Events.js';
import { createRecord , updateSensorStart} from '../../actions/actions';

function mapStateToProps(state) {
  return {
      isLoading:state.sensors.isLoading,
      sensors: state.sensors.sensors,
      user: state.keycloak.idTokenParsed,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createRecord:(record,servicePath)=>{dispatch(createRecord(record,servicePath))},
    updateSensorStart:(sensor,servicePath)=>{dispatch(updateSensorStart(sensor,servicePath))},
  };
}
const EventsContainer = connect(mapStateToProps, mapDispatchToProps)(Events);
export default EventsContainer;
