import {
  LOGIN_REQUEST, LOGIN_REQUEST_IFNEEDED, LOGIN_NOT_NEEDED,
  LOGIN_SUCCEED, LOGIN_FAILED, LOGOUT_REQUEST, LOGOUT_COMPLETED,
  ACCOUNT_MNGMNT, USERREP_REQ, USERREP_RES, USERREP_ERR
} from '../actions/securityActions'
 
const securityReducer = (state={ isAuthenticating: false, authenticated: false, 
  userRepReq: true, userRepRes: false}, action) => {
  switch (action.type) {
    case USERREP_REQ:
      return {
        ...state, 
        userRepReq: true,
        userRepRes: false,
      }
    case USERREP_RES:
      return {
        ...state, 
        userRepReq: false,
        userRepRes: true,
        userRep:  action.userRep
      }
    case USERREP_ERR:
      return {
        ...state,
        userRepReq: false,
        userRepRes: false,
        userRepErrMsg: action.userRepErrMsg
      }
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
    case LOGOUT_COMPLETED:
      return {
        ...state, 
        isAuthenticating: false,
        authenticated: false,
        lastUpdated: action.lastUpdated
      }
    case ACCOUNT_MNGMNT:
      return {
        ...state
      }

    default:
      return state
  }
}

export default securityReducer