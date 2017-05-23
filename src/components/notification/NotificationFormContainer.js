'use strict';
import { connect } from 'react-redux';
import notification from './NotificationForm.js';


function mapStateToProps(state) {
   console.log("map: " + JSON.stringify(state));
   return {
      notifications: state.notifications.notifications,
      currentUser: state.currentUser.currentUser,
   }
}

function mapDispatchToProps(dispatch) {
   return {
   }
}
const NotificationFormContainer = connect(mapStateToProps, mapDispatchToProps)(notification);
export default NotificationFormContainer;

