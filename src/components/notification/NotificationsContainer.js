import { connect } from 'react-redux';
import notification from './Notifications.js';
import { getSensors, getNotifs, createNotif, deleteNotifs, getUsers } from '../../actions/actions.js';

function mapStateToProps(state) {
     console.log("state:" + JSON.stringify(state.notifications))
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
      sensors: state.sensors.sensors,
      users: state.users.users
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNotifs: (user) => {dispatch(getNotifs()) }, 
      deleteNotif: (notifId) => {dispatch(deleteNotif(notifId)) },
      createNotif: (notif) => {dispatch(createNotif(notif)) }, 
      getSensors: () => {dispatch(getSensors()) },
      getUsers: () => {dispatch(getUsers()) }
   }
}
const NotificationFormContainer = connect(mapStateToProps, mapDispatchToProps)(notification);
export default NotificationFormContainer;

