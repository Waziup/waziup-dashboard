import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
//import {load as loadAccount} from './account'

class UserSettings extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="service">Service</label>
          <Field name="service" component="input" type="text"/>
        </div>
        <div>
          <label htmlFor="servicePath">Service Path</label>
          <Field name="servicePath" component="input" type="text"/>
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
  form: 'userSettings', // a unique name for this for
  destroyOnUnmount: false,
  enableReinitialize : true
})(UserSettings);


// You have to connect() to any reducers that you wish to connect to yourself
// UserSettings = connect(
//   state => ({
//     initialValues: state.form.userSettings? state.form.userSettings.values: {} 
//     // pull initial values from userSettings reducer
//   })
// )(UserSettings)

export default UserSettings;