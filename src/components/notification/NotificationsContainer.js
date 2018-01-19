import { connect } from 'react-redux';
import notification from './Notifications.js';
import { loadNotifs, deleteNotif, createNotif } from '../../api-adapter';
import { fetchSensors } from '../../actions/actions.js';


function mapStateToProps(state) {
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
      sensors: state.sensors.sensors,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      loadNotifs: (user) => {dispatch(loadNotifs(user)) }, 
      fetchSensors: () => {dispatch(fetchSensors()) },
      deleteNotif: (id, user) => {dispatch(deleteNotif(id, user)) },
      createNotif: (desc, sensorIds, attrs, qExpr, url, headers, payload, expires, throttling, user) => {dispatch(createNotif(desc, sensorIds, attrs, qExpr, url, headers, payload, expires, throttling, user)) }, 
   }
}
const NotificationFormContainer = connect(mapStateToProps, mapDispatchToProps)(notification);
export default NotificationFormContainer;

