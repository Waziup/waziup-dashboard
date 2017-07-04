import { connect } from 'react-redux';
import notifDetail from './NotifDetail.js';

function mapStateToProps(state) {
    return {
      notifications: state.notifications.notifications,
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
const notifDetailContainer = connect( mapStateToProps,mapDispatchToProps)(notifDetail);
export default notifDetailContainer;
