import { connect } from 'react-redux';
import notifDetail from './NotifDetail.js';
import { loadNotifs } from '../../../api-adapter';

function mapStateToProps(state) {
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      loadNotifs: (user) => {dispatch(loadNotifs(user)) }, 
   }
}
const notifDetailContainer = connect(mapStateToProps, mapDispatchToProps)(notifDetail);
export default notifDetailContainer;
