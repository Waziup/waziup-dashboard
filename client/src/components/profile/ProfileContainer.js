import { connect } from 'react-redux';
import Profile from './Profile.js';
import { updateUser } from '../../actions/actions';


function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed
    }
}

function mapDispatchToProps(dispatch) {
    return {
        updateUser:(user)=>{dispatch(updateUser(user))},
    }
}
const ProfileContainer = connect( mapStateToProps,mapDispatchToProps)(Profile);
export default ProfileContainer;
