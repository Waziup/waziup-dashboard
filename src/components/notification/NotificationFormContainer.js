'use strict';
import { connect } from 'react-redux';
import notification from './NotificationForm.js';


function mapStateToProps(state) {
   return {
      notifications: state.notifications
      currentUser: state.currentUser.currentUser,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      fetchNotifications:(service, servicePath)=>{dispatch(fetchNotifications(service, servicePath))}
   }
}
const NotificationFormContainer = connect( mapStateToProps,mapDispatchToProps)(notification);
export default NotificationFormContainer;

