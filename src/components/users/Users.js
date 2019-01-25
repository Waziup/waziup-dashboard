import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { deleteUser, getUsers } from '../../actions/actions';
import UserCard from './UserCard.js';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const users = [];
    if (this.props.users) {
      for (const user of this.props.users) {
        const card = (
          <Link to={`/users/${user.id}`}>
            <UserCard
              className="sensorNode"
              isEditable={false}
              user={user}
            />
          </Link>
        );
        users.push(card);
      }
    }

    return (
      <Container fluid>
        <h1 className="page-title">
Users
        </h1>
        {users}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.users,
  keycloak: state.keycloak,
});

const mapDispatchToProps = dispatch => ({
  getUsers: () => {
    dispatch(getUsers());
  },
  deleteUser: (id) => {
    dispatch(deleteUser(id));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(Users);
