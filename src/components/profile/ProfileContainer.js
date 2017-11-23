import { connect } from 'react-redux';
import Profile from './Profile.js';

function mapStateToProps(state) {
    return {
        user: state.keycloak.tokenParsed
    }
}

function mapDispatchToProps(dispatch) {
}
const ProfileContainer = connect( mapStateToProps,mapDispatchToProps)(Profile);
export default ProfileContainer;
