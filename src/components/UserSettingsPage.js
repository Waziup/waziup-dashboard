import UserSettings from './UserSettings';
import React from 'react';

class UserSettingsPage extends React.Component {
  submit = (values) => {
    // Do something with the form values
    console.log(values);
  }

  render() {
    return (
      <UserSettings onSubmit={this.submit} />
    );
  }
}

export default UserSettingsPage;