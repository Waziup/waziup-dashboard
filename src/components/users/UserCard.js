import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import userImage from '../../images/user-icon.png';
import facebookImage from '../../images/facebook.png';
import twitterImage from '../../images/twitter.png';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MailIcon from '@material-ui/icons/Mail';
import PhoneIcon from '@material-ui/icons/Smartphone';
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
        <div className="TypographyDiv">
          <pre className="Typography"> {user.username} </pre>
          <div className="TypographyIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => {if(window.confirm('Delete user?')) this.props.deleteUser(user.id)}}/>: null }
          </div>
        </div>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={userImage} height="100"/>
            <pre> {user.firstName} {user.lastName}</pre>
            <pre> <MailIcon/> {user.email}</pre>
            <pre> <PhoneIcon/> {user.phone}</pre>
            <pre> <img src={facebookImage} height="16"/> {user.facebook}</pre>
            <pre> <img src={twitterImage} height="16"/> {user.twitter}</pre>

          </div>
        </div>
      </Card>
    );
  }

  static propTypes = {
    user: PropTypes.object.isRequired, //Should be a Waziup.Device
    updateUser: PropTypes.func,
    deleteUser: PropTypes.func,
    isEditable: PropTypes.bool
  }
}
