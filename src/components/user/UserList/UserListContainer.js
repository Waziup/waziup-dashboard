import { connect } from 'react-redux'
import UserList from './UserList'
import { loadUsers } from '../../../api-adapter';

const mapStateToProps = (state) => {
    return {
      users: state.users,
      keycloak: state.keycloak
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       loadUsers: (realm) => {dispatch(loadUsers(realm)) },
       deleteUser: (id, realm) => {dispatch(deleteUser(id, realm)) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserList)
