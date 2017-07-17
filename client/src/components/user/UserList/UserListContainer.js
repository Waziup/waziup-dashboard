import { connect } from 'react-redux'
import UserList from './UserList'
// import {fetchUser} from 'actionCreatorPath'

const mapStateToProps = (state) => {
    return {
      users: state.users.users,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(UserList)
