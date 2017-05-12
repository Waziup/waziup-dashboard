import React, { Component } from 'react'
import { connect } from 'react-redux'
import User from '../components/User'
import SensingDevices from '../components/SensingDevices'
import { fetchDevicesList } from '../actions/sensingDeviceActions'
import { Button } from 'react-bootstrap';
import { ButtonToolbar } from 'react-bootstrap';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showUserComponent: false,
      showSensingDevicesComponent: false
    };

    this.handleUserComponent = this.handleUserComponent.bind(this)
    this.handleSensingDevicesComponent = this.handleSensingDevicesComponent.bind(this)
  }

  componentDidMount() {
  }

  handleUserComponent = e => {
    e.preventDefault()
    this.setState({ showUserComponent: !this.state.showUserComponent });
  }

  handleSensingDevicesComponent = e => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(fetchDevicesList())
    this.setState({ showSensingDevicesComponent: !this.state.showSensingDevicesComponent });
  }

  render() {
    const userInfo = this.props.userInfo
    return (
      <div>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css"/>
        <ButtonToolbar>
          {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
          <Button bsStyle="primary" onClick={this.handleUserComponent}>User Info</Button>
          {/* Indicates a successful or positive action */}
          <Button bsStyle="success" onClick={this.handleSensingDevicesComponent}> Sensing Devices</Button>
          {/* Standard button */}
          <Button>Default</Button>

          {/* Contextual button for informational alert messages */}
          <Button bsStyle="info">Info</Button>

          {/* Indicates caution should be taken with this action */}
          <Button bsStyle="warning" >Warning</Button>

          {/* Indicates a dangerous or potentially negative action */}
          <Button bsStyle="danger" disabled >Danger</Button>

          {/* Deemphasize a button by making it look like a link while maintaining button behavior */}
          <Button bsStyle="link" disabled>Link</Button>
        </ButtonToolbar>
         {this.state.showSensingDevicesComponent && <SensingDevices userInfo={userInfo} />}
         {this.state.showUserComponent && <User userInfo={userInfo} />}

      </div>
    );
  }
}

const mapStateToProps = state => {
  //console.log("state.security.userInfo in Dashboard:" + JSON.stringify(state.security.userInfo)); // state
  return { userInfo: state.security.userInfo }
}

export default connect(mapStateToProps)(Dashboard)