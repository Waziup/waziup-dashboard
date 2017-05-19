import Keycloak from 'keycloak-js';

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_REQUEST_IFNEEDED = 'LOGIN_REQUEST_IFNEEDED'
export const LOGIN_NOT_NEEDED = 'LOGIN_NOT_NEEDED'
export const LOGIN_SUCCEED = 'LOGIN_SUCCEED'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED'
export const ACCOUNT_MNGMNT = 'ACCOUNT_MNGMNT'

//accountManagement()Redirects to the Account Management Console.

export const loginRequest = () => ({
  type: LOGIN_REQUEST
})

export const loginRequestIfNeeded = () => ({
  type: LOGIN_REQUEST_IFNEEDED
})

export const loginNotNeeded = () => ({
  type: LOGIN_NOT_NEEDED
})

export const loginSucceed = (kc) => ({
  type: LOGIN_SUCCEED,
  userInfo: kc,
  lastUpdated: Date.now()
})

export const loginFailed = (errMsg) => ({
  type: LOGIN_FAILED,
  errMsg: 'errMsg with kc.file',
  lastUpdated: Date.now()
})

export const logoutRequest = () => ({
  type: LOGOUT_REQUEST,
  lastUpdated: Date.now()
})

export const logoutCompleted = () => ({
  type: LOGOUT_COMPLETED,
  lastUpdated: Date.now()
})

export const doLogout = () => (dispatch, getState) => {
  dispatch(logoutRequest())
  //URL http://localhost:3000
  getState().security.userInfo.logout({redirectUri: '/'}).success(done => {
     dispatch(logoutCompleted())
     console.log("Logout: " + done);
    }).error( () => {
     //dispatch(logoutFailed())
     console.log("Logout failed: ");
    }
  )
}

//Redirects to the Account Management Console.
export const accountManagement = () => (dispatch, getState) => {
  //dipatch({ type: LOGIN_REQUEST})
  getState().security.userInfo.accountManagement().success(done => {
     //dispatch(logoutCompleted())
     console.log("accountManagement: " + done);
     
    }).error( () => {
     //dispatch(logoutFailed())
     console.log("accountManagement failed: ");
    }
  )
}

const doLogin = () => dispatch => {
  //login process started by dipatching login action
  dispatch(loginRequest())
  //const kc = state.securityReducer.keycloak;
  const kc = Keycloak('/keycloak.json');
  // state.security.authenticated;
  // break into several actions
  // use KC callbacks on login-success, or login-failure, etc.
  return kc.init({onLoad: 'login-required'}).success(authenticated => {
    //console.log("AUTH STATUS: " + authenticated);
    if(!authenticated) {
      kc.login();
    } else {
      kc.loadUserInfo().success(function (profile) {
        //alert(JSON.stringify(profile, null, "  "));
      }).error(function () {
        alert('Failed to load user profile');
      });
        dispatch(loginSucceed(kc));
      }}).error(function() {
        dispatch(loginFailed("Init Error KeyCloak."));
      });
}

const shouldLogin = (authenticated) => {
  if (!authenticated) {
    return true
  }
  return false
}

export const doLoginRequestIfNeeded = () => (dispatch, getState) => {
  dispatch(loginRequestIfNeeded())
  if (shouldLogin(getState().security.authenticated)) {
    return dispatch(doLogin())
  }
  return dispatch(loginNotNeeded())
}