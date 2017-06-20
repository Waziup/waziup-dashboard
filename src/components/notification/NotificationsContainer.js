import { connect } from 'react-redux';
import notification from './Notifications.js';


function mapStateToProps(state) {
   return {
      notifications: state.notifications.notifications,
      sensors: state.sensors.sensors,
   }
}

function mapDispatchToProps(dispatch) {
   return {
   }
}
const NotificationFormContainer = connect(mapStateToProps, mapDispatchToProps)(notification);
export default NotificationFormContainer;

