import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {connect} from 'react-redux'
//import {load as loadAccount} from './account'

class UserSettings extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component="input" type="email"/>
        </div>
        <button type="submit" disabled={pristine || submitting}>Submit</button>
        <button type="button" disabled={pristine || submitting} onClick={reset}>
          Reset
        </button>
      </form>
    );
  }
}

// Decorate the form component
UserSettings = reduxForm({
  form: 'userSettings' // a unique name for this form
})(UserSettings);


// You have to connect() to any reducers that you wish to connect to yourself
UserSettings = connect(
  state => ({
    initialValues: state.userSettings? state.userSettings.values: state.userSettings // pull initial values from userSettings reducer
  })
)(UserSettings)

//,{load: loadAccount} // bind userSettings loading action creator
export default UserSettings;