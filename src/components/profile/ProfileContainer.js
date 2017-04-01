import { connect } from 'react-redux';
import Profile from './Profile.js';
import { updateUser,adminLogin } from '../../actions/actions';
// import {} from '../../redux/action/ActionCounter.js';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser:(user)=>{dispatch(updateUser(user))},
        adminLogin:()=>{dispatch(adminLogin())}
    }
}
const ProfileContainer = connect( mapStateToProps,mapDispatchToProps)(Profile);
export default ProfileContainer;
