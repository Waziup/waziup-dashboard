import { connect } from 'react-redux'
import UserList from './UserList'
import { getUsers } from '../../../actions/actions';

const mapStateToProps = (state) => {
    return {
      users: state.users,
      keycloak: state.keycloak
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       getUsers: () => {dispatch(getUsers()) },
       deleteUser: (id) => {dispatch(deleteUser(id)) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserList)
