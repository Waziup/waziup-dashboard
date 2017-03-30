'use strict';
import { connect } from 'react-redux';
import notifsubmitform from './SubmitNotificationForm.js';


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}
const SubmitNotificationFormContainer = connect( mapStateToProps,mapDispatchToProps)(notifsubmitform);
export default SubmitNotificationFormContainer;

