import React, {Component} from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form'
 import RaisedButton from 'material-ui/RaisedButton';
import { TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'

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
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}/>,
    ];
    return (
      <Dialog title={"User profile"} actions={actions} modal={true} open={modalOpen}>
        <TextField
          name="firstName"
          floatingLabelText="First name"
          value={this.state.user.firstName}
          onChange={this.handleChange}/>
        <TextField
          name="lastName"
          floatingLabelText="Last name"
          value={this.state.user.lastName}
          onChange={this.handleChange}/>
        <TextField
          name="email"
          floatingLabelText="Email"
          value={this.state.user.email}
          onChange={this.handleChange}/>
        <TextField
          name="phone"
          floatingLabelText="Phone"
          value={this.state.user.phone}
          onChange={this.handleChange}/>
        <TextField
          name="facebook"
          floatingLabelText="Last name"
          value={this.state.user.facebook}
          onChange={this.handleChange}/>
        <TextField
          name="twitter"
          floatingLabelText="Twitter"
          value={this.state.user.twitter}
          onChange={this.handleChange}/>
      </Dialog>
    );
  }

  propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }
}

export default reduxForm({form: 'simple'})(SettingsForm)
