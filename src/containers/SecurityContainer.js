import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doLoginRequestIfNeeded, doLogout} from '../actions/securityActions'
import Dashboard from './Dashboard'

class SecurityContainer extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    userInfo: PropTypes.object,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.handleLoginClick = this.handleLoginClick.bind(this)
    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  componentDidMount() {
    const { dispatch, authenticated, isAuthenticating} = this.props
    dispatch(doLoginRequestIfNeeded(authenticated, isAuthenticating))
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.authenticated !== this.props.authenticated || nextProps.isAuthenticating !== this.props.isAuthenticating) {
    //   const { dispatch, authenticated, isAuthenticating } = nextProps
    // }
  }

  handleLoginClick = e => {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(doLoginRequestIfNeeded())
  }

  handleLogoutClick= e => {
    e.preventDefault()
    const {dispatch} = this.props
    dispatch(doLogout())
  }

  render() {
    const {authenticated, isAuthenticating, lastUpdated} = this.props
    const isAuthenticated = authenticated === true
    console.log(" PROPS in App: "+ this.props.authenticated, this.props.isAuthenticating, this.props.lastUpdated)
    //console.log(isAuthenticated +'isAuthenticated in App')
    return (
      <div>
        <p>
          {lastUpdated &&
            <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          { isAuthenticated === true
          ?
          <a href="#" onClick={this.handleLogoutClick}>
              Logout
          </a> 
          :
          <a href="#"
               onClick={this.handleLoginClick}>
              Login or Re-Login
          </a>
          }
        {' '}
          {!isAuthenticating &&
              <a href="#"
               onClick={this.handleLoginClick}>
              Re-Login
            </a>
          }
         {' '} 
        </p>
        {isAuthenticated === true
          ? (isAuthenticating ? <h2>Re-Authenticating the already authenticated user with KeyCloak...</h2> :
           <h2>The user is already authenticated.
             
             <Dashboard /></h2> 
             )
          : <div style={{ opacity: isAuthenticating ? 0.5 : 1 }}>
             User is not authenticated. 
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return state.security
}

export default connect(mapStateToProps)(SecurityContainer)