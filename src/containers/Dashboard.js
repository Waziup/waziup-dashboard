import React, { Component } from 'react'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import User from '../components/User'
import SensingDevices from '../components/SensingDevices'
import { fetchDevicesList} from '../actions/sensingDeviceActions'

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
      <MuiThemeProvider>
        import RaisedButton from 'material-ui/RaisedButton';
        <RaisedButton label="Default" />

        <a href="#" onClick={this.handleUserComponent}> User Info </a>
        {this.state.showUserComponent && <User userInfo={userInfo} />}
        {" --  "}
        <a href="#" onClick={this.handleSensingDevicesComponent}> Sensing Devices </a>
        {this.state.showSensingDevicesComponent && <SensingDevices userInfo={userInfo} />}

      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  console.log("state.security.userInfo in Dashboard:" + JSON.stringify(state.security.userInfo)); // state
  return { userInfo: state.security.userInfo }
}

export default connect(mapStateToProps)(Dashboard)