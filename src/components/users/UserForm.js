import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'


class UserForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      user: this.props.user
    };
  }
  
  handleChange = (formData) => {
    var user = this.state.user
    user[formData.target.name] = formData.target.value;
    this.setState({user: user})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.user); handleClose();}}/>,
    ];

    return (
        <Dialog title={"Update User"} actions={actions} modal={true} open={modalOpen}>
          <TextField name="id" disabled={true} floatingLabelText="User ID" value={this.state.user.id} title="ID of the user"/>
          <TextField name="firstName"  floatingLabelText="First name" value={this.state.user.firstName} onChange={this.handleChange} title="first name"/>
          <TextField name="lastName"   floatingLabelText="Last name"  value={this.state.user.lastName}  onChange={this.handleChange} title="last name"/>
          <TextField name="email"      floatingLabelText="email"      value={this.state.user.email}     onChange={this.handleChange} title="email"/>
          <TextField name="phone"      floatingLabelText="phone"      value={this.state.user.phone}     onChange={this.handleChange} title="phone"/>
          <TextField name="facebook"   floatingLabelText="Facebook"   value={this.state.user.facebook}  onChange={this.handleChange} title="Facebook"/>
          <TextField name="twitter"    floatingLabelText="Twitter"    value={this.state.user.twitter}   onChange={this.handleChange} title="Twitter"/>
        </Dialog>
      );
  }

  propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}

export default reduxForm({form: 'simple'})(UserForm)
