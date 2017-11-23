import { connect } from 'react-redux';
import SettingsForm from './SettingsForm.js';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed,
        currentUser: state.currentUser.currentUser
    }
}

function mapDispatchToProps(dispatch) {
}
const SettingsFormContainer = connect( mapStateToProps,mapDispatchToProps)(SettingsForm);
export default SettingsFormContainer;
