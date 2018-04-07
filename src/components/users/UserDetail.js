import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { Container } from 'react-grid-system'
import { List, ListItem } from 'material-ui/List';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import userImage from '../../images/user-icon.png';
import UserCard from './UserCard.js';
import UserForm from './UserForm.js';
import { browserHistory } from 'react-router'
import { getUsers, deleteUser, updateUser, getPermissions } from '../../actions/actions';

class UserDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  componentWillMount() {
    this.props.getUsers();
    this.props.getPermissions();
  }
  
  render() {
    let renderElement = <h1> User view is being loaded... </h1>;
    let user = this.props.user;
    if (user) {
      renderElement =
        <Container fluid={true}>
          <h1 className="page-title">
            <img src={userImage} height="40"/>
            User
          </h1>
          <UserCard className="sensorNode"
                    user={user}
                    permissions={this.props.permissions} 
                    isEditable={true}
                    updateUser={this.props.updateUser}
                    deleteiUser={this.props.deleteUser}/>
        </Container>
    } else {
      browserHistory.push('/users')
    }

    return (
      <div className="sensor">
               
        {renderElement}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
    return {
      user: state.users.users.find((el) => (el.id === ownProps.params.userId)),
      permissions: (ownProps.params.userId == state.user.user.id? state.permissions.permissions: null)
    }
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => {dispatch(getUsers()) },
    deleteUser: (id) => {dispatch(deleteUser(id)) },
    updateUser: (id, u) => {dispatch(updateUser(id, u)) },
    getPermissions: () => {dispatch(getPermissions()) }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);
