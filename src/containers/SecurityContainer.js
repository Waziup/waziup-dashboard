import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { doLoginRequestIfNeeded} from '../actions/securityActions'
import Dashboard from './Dashboard'

class SecurityContainer extends Component {
  static propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
    userInfo: PropTypes.object,
    lastUpdated: PropTypes.number,
//    dispatch: PropTypes.func.isRequired
  }

  //constructor(props) {
    //super(props)
    // this.handleLoginClick = this.handleLoginClick.bind(this)
    // this.handleLogoutClick = this.handleLogoutClick.bind(this)
  //}

  componentDidMount() {
    const { dispatch, authenticated, isAuthenticating} = this.props
    dispatch(doLoginRequestIfNeeded(authenticated, isAuthenticating))
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.authenticated !== this.props.authenticated || nextProps.isAuthenticating !== this.props.isAuthenticating) {
    //   const { dispatch, authenticated, isAuthenticating } = nextProps
    // }
  }

  // handleLoginClick = e => {
  //   e.preventDefault()
  //   const {dispatch} = this.props
  //   dispatch(doLoginRequestIfNeeded())
  // }



  render() {
    const {authenticated, isAuthenticating} = this.props
    const isAuthenticated = authenticated === true
    //console.log(" PROPS in App: "+ this.props.authenticated, this.props.isAuthenticating, this.props.lastUpdated)
    if(isAuthenticated === true)
      return (<Dashboard />)
    else
      return (<div style={{ opacity: isAuthenticating ? 0.5 : 1 }}>
             User is not authenticated. 
            </div>)
  }
}

const mapStateToProps = state => {
  return state.security
}

export default connect(mapStateToProps)(SecurityContainer)