import { connect } from 'react-redux';
import notification from './Notifications.js';
import { getSensors, getNotifs, createNotif, deleteNotifs } from '../../actions/actions.js';

function mapStateToProps(state) {
     console.log("state:" + JSON.stringify(state.notifications))
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
      sensors: state.sensors.sensors,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNotifs: (user) => {dispatch(getNotifs()) }, 
      getSensors: () => {dispatch(getSensors()) },
      deleteNotif: (notifId) => {dispatch(deleteNotif(notifId)) },
      createNotif: (notif) => {dispatch(createNotif(notif)) }, 
   }
}
const NotificationFormContainer = connect(mapStateToProps, mapDispatchToProps)(notification);
export default NotificationFormContainer;

