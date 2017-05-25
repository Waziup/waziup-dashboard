import UserSettings from './UserSettings';
import React from 'react';
import { connect } from 'react-redux'

class UserSettingsPage extends React.Component {
  submit = (values) => {
    // Do something with the form values
    //console.log(values);
    this.props.security.userInfo.userInfo.Service = values.service
    this.props.security.userInfo.userInfo.ServicePath = values.servicePath
    
    //console.log(JSON.stringify(this.props.security.userInfo.userInfo))
  }

  render() {
    return (
      <UserSettings onSubmit={this.submit} />
    );
  }
}

const mapStateToProps = state => {
  return {security: state.security}
}

export default connect(mapStateToProps)(UserSettingsPage)

