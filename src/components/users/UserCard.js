import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import userImage from '../../images/user-icon.png';
import facebookImage from '../../images/facebook.png';
import twitterImage from '../../images/twitter.png';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import MailIcon from 'material-ui/svg-icons/content/mail';
import PhoneIcon from 'material-ui/svg-icons/hardware/smartphone';
import UserForm from './UserForm.js';

export default class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  render() {
    let user = this.props.user;

    return ( 
      <Card className="card">
        <UserForm user={user}
                  modalOpen={this.state.modalEdit}
                  handleClose={() => this.setState({ modalEdit: false })}
                  onSubmit={u => this.props.updateUser(user.id, u)} />
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {user.username} </pre>
          <div className="cardTitleIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => {if(window.confirm('Delete notification?')) this.props.deleteUser(user.id)}}/>: null }
          </div>
        </div>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={userImage} height="100"/>
            <pre> {user.firstName}</pre>
            <pre> {user.lastName}</pre>
            <pre> <MailIcon/> {user.email}</pre>
            <pre> <PhoneIcon/> {user.phone}</pre>
            <pre> <img src={facebookImage} height="16"/> {user.facebook}</pre>
            <pre> <img src={twitterImage} height="16"/> {user.twitter}</pre>
          </div>
        </div>
      </Card>
    );
  }

  propTypes = {
    user: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    updateUser: PropTypes.func,
    deleteUser: PropTypes.func,
    isEditable: PropTypes.bool
  }
}
