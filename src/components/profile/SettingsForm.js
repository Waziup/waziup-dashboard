import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form';
 import Button from '@material-ui/core/Button';
import { TextField } from 'redux-form-material-ui';

class settingsForm extends Component {
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
    const {reset, modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button label="Cancel" primary={true} onTouchTap={()=>{handleClose();}}/>,
      <Button label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}/>,
    ];
    return (
      <Dialog title={"User profile"} actions={actions} modal={true} open={modalOpen}>
        <TextField
          name="firstName"
          label="First name"
          value={this.state.user.firstName}
          onChange={this.handleChange}/>
        <TextField
          name="lastName"
          label="Last name"
          value={this.state.user.lastName}
          onChange={this.handleChange}/>
        <TextField
          name="email"
          label="Email"
          value={this.state.user.email}
          onChange={this.handleChange}/>
        <TextField
          name="phone"
          label="Phone"
          value={this.state.user.phone}
          onChange={this.handleChange}/>
        <TextField
          name="facebook"
          label="Last name"
          value={this.state.user.facebook}
          onChange={this.handleChange}/>
        <TextField
          name="twitter"
          label="Twitter"
          value={this.state.user.twitter}
          onChange={this.handleChange}/>
      </Dialog>
    );
  }

  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}

export default reduxForm({form: 'simple'})(SettingsForm)
