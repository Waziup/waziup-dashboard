import { connect } from 'react-redux';
import Settings from './Settings.js';
import { updateUser,adminLogin } from '../../actions/actions';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed,
        currentUser: state.currentUser.currentUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser:(user,attrs)=>{dispatch(updateUser(user,attrs))},
        adminLogin:(user)=>{dispatch(adminLogin(user))}
    }
}
const SettingsContainer = connect( mapStateToProps,mapDispatchToProps)(Settings);
export default SettingsContainer;
