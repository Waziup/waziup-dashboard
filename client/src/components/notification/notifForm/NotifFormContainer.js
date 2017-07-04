import { connect } from 'react-redux';
import NotifForm from './NotifForm.js';


function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
    }
}
const notifFormContainer = connect(mapStateToProps, mapDispatchToProps)(NotifForm);
export default notifFormContainer;
