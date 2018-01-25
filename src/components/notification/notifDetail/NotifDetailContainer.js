import { connect } from 'react-redux';
import notifDetail from './NotifDetail.js';
import { getNotifs } from '../../../actions/actions';

function mapStateToProps(state) {
   return {
      user: state.keycloak.idTokenParsed,
      notifications: state.notifications.notifications,
   }
}

function mapDispatchToProps(dispatch) {
   return {
      getNotifs: (user) => {dispatch(getNotifs(user)) }, 
   }
}
const notifDetailContainer = connect(mapStateToProps, mapDispatchToProps)(notifDetail);
export default notifDetailContainer;
