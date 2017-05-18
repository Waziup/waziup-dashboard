'use strict';
import { connect } from 'react-redux';
import notification from './NotificationForm.js';


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}
const NotificationFormContainer = connect( mapStateToProps,mapDispatchToProps)(notification);
export default NotificationFormContainer;

