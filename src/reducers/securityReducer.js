import {
  LOGIN_REQUEST, LOGIN_REQUEST_IFNEEDED, LOGIN_NOT_NEEDED,
  LOGIN_SUCCEED, LOGIN_FAILED, LOGOUT_REQUEST
} from '../actions/securityActions'

//= 
const securityReducer = (state={ isAuthenticating: false, authenticated: false }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state, 
        isAuthenticating: true,
        //lastUpdated: action.lastUpdated,
      }
    case LOGIN_REQUEST_IFNEEDED:
      return {
        ...state, 
        //isAuthenticating: false,
        //lastUpdated: action.lastUpdated,
      }
    case LOGIN_NOT_NEEDED:
      return {
        ...state, 
        //isAuthenticating: false,
        //lastUpdated: action.lastUpdated,
      }   
    case LOGIN_SUCCEED:
      return {
        ...state, 
        isAuthenticating: false,
        authenticated: true,
        lastUpdated: action.lastUpdated,
        userInfo: action.userInfo
      }
    case LOGIN_FAILED:
      return {
        ...state, 
        isAuthenticating: false,
        authenticated: false,
        lastUpdated: action.lastUpdated,
        errMsg: action.errMsg
      }
    case LOGOUT_REQUEST:
      return {
        ...state, 
        isAuthenticating: false,
        authenticated: false,
        lastUpdated: action.lastUpdated
//        userInfo: action.userInfo
      }
    default:
      return state
  }
}

export default securityReducer