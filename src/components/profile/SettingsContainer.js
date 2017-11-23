import { connect } from 'react-redux';
import Settings from './Settings.js';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed,
        currentUser: state.currentUser.currentUser
    }
}


const SettingsContainer = connect(mapStateToProps)(Settings);
export default SettingsContainer;