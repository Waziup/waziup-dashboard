import React from 'react'
import PropTypes from 'prop-types'
import '../App.css';

const User = ({userInfo}) => (
  <ul>
    <p className="App-intro">
      idTokenParsed: {JSON.stringify(userInfo.idTokenParsed)}
    </p>
    <p className="App-intro">
      subject: {JSON.stringify(userInfo.subject)}
    </p>
    <p className="App-intro">
      realmAccess: {JSON.stringify(userInfo.realmAccess)}
    </p>
    <p className="App-intro">
      resourceAccess: {JSON.stringify(userInfo.resourceAccess)}
    </p>
    <p className="App-intro">
      refreshToken: {JSON.stringify(userInfo.refreshToken)}
    </p>
    <p className="App-intro">
      refreshTokenParsed: {JSON.stringify(userInfo.refreshTokenParsed)}
    </p>
    <p className="App-intro">
      tokenParsed: {JSON.stringify(userInfo.tokenParsed)}
    </p>
    <p className="App-intro">
      responseMode: {JSON.stringify(userInfo.responseMode)}
    </p>
    <p className="App-intro">
      flow: {JSON.stringify(userInfo.flow)}
    </p>
    <p className="App-intro">
      responseType: {JSON.stringify(userInfo.responseType)}
    </p>
  </ul>
)

User.propTypes = {
  userInfo: PropTypes.object.isRequired
}

export default User