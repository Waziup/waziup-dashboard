import React, { Component } from 'react';
import { Container } from 'react-grid-system'
import { connect } from 'react-redux';
import { getUsers, deleteUser } from '../../actions/actions';
import UserCard from './UserCard.js';
import { Link } from 'react-router';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    var users = []
    if(this.props.users) {
      for(var user of this.props.users) {
         const card = 
           <Link to={"/users/" + user.id} > 
             <UserCard className="sensorNode"
                       user={user}
                       isEditable={false}/>
           </Link>
         users.push(card)
      }
    }

    return (
      <Container fluid={true}>
        <h1 className="page-title">Users</h1>
        {users}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      users: state.users.users,
      keycloak: state.keycloak
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       getUsers: () => {dispatch(getUsers()) },
       deleteUser: (id) => {dispatch(deleteUser(id)) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Users)
