import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { Container } from 'react-grid-system';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { browserHistory } from 'react-router';
import userImage from '../../images/user-icon.png';
import UserCard from './UserCard.js';
import UserForm from './UserForm.js';
import {
  deleteUser, getPermissions, getUsers, updateUser,
} from '../../actions/actions';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { modalEdit: false };
  }

  componentWillMount() {
    this.props.getUsers();
    this.props.getPermissions();
  }

  render() {
    let renderElement = (
      <h1>
        {' '}
User view is being loaded...
        {' '}
      </h1>
    );
    const user = this.props.user;
    if (user) {
      renderElement = (
        <Container fluid>
          <h1 className="page-title">
            <img
              height="40"
              src={userImage}
            />
            User
          </h1>
          <div>
            <a href={`/users/${this.props.user.id}/perms`}>
              {' '}
view permissions
              {' '}
            </a>
          </div>
          <UserCard
            className="deviceNode"
            deleteUser={this.props.deleteUser}
            isEditable
            updateUser={this.props.updateUser}
            user={user}
          />
        </Container>
      );
    } else {
      browserHistory.push('/users');
    }

    return (
      <div className="device">

        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return { user: state.users.users.find(el => el.id === ownProps.params.userId) };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => {
      dispatch(getUsers());
    },
    deleteUser: (id) => {
      dispatch(deleteUser(id));
    },
    updateUser: (id, u) => {
      dispatch(updateUser(id, u));
    },
    getPermissions: () => {
      dispatch(getPermissions());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
