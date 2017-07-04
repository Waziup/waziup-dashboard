import { connect } from 'react-redux';
import SettingsForm from './SettingsForm.js';
import { updateUser,adminLogin } from '../../../actions/actions';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed,
        currentUser: state.currentUser.currentUser
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser:(user)=>{dispatch(updateUser(user))},
        adminLogin:()=>{dispatch(adminLogin())}
    }
}
const SettingsFormContainer = connect( mapStateToProps,mapDispatchToProps)(SettingsForm);
export default SettingsFormContainer;
