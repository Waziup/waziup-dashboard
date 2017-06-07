import Keycloak from 'keycloak-js';
import axios from 'axios'

//import kcConfig from 'keycloak.json';

export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_REQUEST_IFNEEDED = 'LOGIN_REQUEST_IFNEEDED'
export const LOGIN_NOT_NEEDED = 'LOGIN_NOT_NEEDED'
export const LOGIN_SUCCEED = 'LOGIN_SUCCEED'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_COMPLETED = 'LOGOUT_COMPLETED'
export const ACCOUNT_MNGMNT = 'ACCOUNT_MNGMNT'
export const USERREP_REQ = 'USERREP_REQ'
export const USERREP_RES = 'USERREP_RES'
export const USERREP_ERR = 'USERREP_ERR'


  // case USERREP_REQ:
  //     return {
  //       ...state, 
  //       userRepReq: true,
  //       userRepRes: false,
  //     }
  
export const userRepReqAction = () => ({
  type: USERREP_REQ
})

    // case USERREP_RES:
    //   return {
    //     ...state, 
    //     userRepReq: false,
    //     userRepRes: true,
    //     userRep:  action.userRep
    //   }

export const userRepResAction = (userRep) => ({
  type: USERREP_RES,
  userRep: userRep
})

// case USERREP_ERR:
//       return {
//         ...state,
//         userRepReq: false,
//         userRepRes: false,
//         userRepErrMsg: action.userRepErrMsg
//       }

export const userRepErrAction = (errMsg) => ({
  type: USERREP_ERR,
  userRepErrMsg: errMsg
})

//Get representation of the user
//GET 
//User id
//realm name (not id!)
//Responses
//HTTP Code	Description	Schema
//UserRepresentation
//application/json



// curl -X GET 'http://localhost:8080/auth/admin/realms' \
// -H "Accept: application/json" \
// -H "Authorization: Bearer $TKN" | jq .

// axios.get(url, {
//     params: { 'lastN': '24' },
//     headers: {
//       'Fiware-ServicePath': sp,
//       'Fiware-Service': service,
//       "Accept": "application/json"
//     }

export const userRepReq = () => (dispatch, getState) => {
  //userRepReq started by dipatching userRepReqAction
  dispatch(userRepReqAction())

  //let kcc = require('./public/keycloak.json')
    // fetch('keycloak.json').then(response => response.json()).then(data => {
  //   console.log(data); // here's your json
  // });
  let realm = 'waziup'
  let authServerUrl = "http://aam.waziup.io/auth"
  let resource = "mehditest"
  let userId = getState().security.userInfo.subject
  //"public-client": true
  //admin-cli admin token
  // export TKN=$(curl -X POST 'http://localhost:8080/auth/realms/master/protocol/openid-connect/token' \
//  -H "Content-Type: application/x-www-form-urlencoded" \
//  -d "username=admin" \
//  -d 'password=admin' \
//  -d 'grant_type=password' \
//  -d 'client_id=admin-cli' | jq -r '.access_token')
  let url = authServerUrl + "/admin/realms/master/protocol/openid-connect/token"
  axios.post(url, {
    params: {
      'client_id': 'admin-cli',
      'username': 'admin',
      'password': 'KCadminW',
      'grant_type': 'password'
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Bearer': getState().security.userInfo.token
    }
  }).then((response) => {
    dispatch(userRepResAction(response))
    console.log('res', response)

  }).catch((response) => {
    dispatch(userRepErrAction(response.stack))
    console.log('res', response)
  })



  //
  // url = authServerUrl + "/admin/realms/" + realm + "/users/" + userId
  // axios.get(url, {
  //   params: { 'client_id': resource },
  //   headers: {
  //     "Accept": "application/json",
  //     'Access-Control-Allow-Origin': '*'
  //   }
  // }).then((response) => {
  //   dispatch(userRepResAction(response))
  //   console.log('res', response)

  // }).catch((response) => {
  //   dispatch(userRepErrAction(response.stack))
  //   console.log('res', response)
  // })


  //console.log(JSON.stringify(kcc))
  // authServerUrl = config['auth-server-url'];
  // realm = config['realm'];
  // clientId = config['resource'];
  // clientSecret = (config['credentials'] || {})['secret'];

  // state.security.authenticated;
  // break into several actions
  // use KC callbacks on login-success, or login-failure, etc.
  // return kc.init({onLoad: 'login-required'}).success(authenticated => {
  //   if(!authenticated) {
  //     kc.login();
  //   } else {
  //     kc.loadUserInfo().success(function (profile) {
  //       //alert(JSON.stringify(profile, null, "  "));
  //     }).error(function () {
  //       alert('Failed to load user profile');
  //     });
  //       dispatch(loginSucceed(kc));
  //     }}).error(function() {
  //       dispatch(loginFailed("Init Error KeyCloak."));
  //     });
}



// Update the user
// PUT /admin/realms/{realm}/users/{id}
// Parameters
// Type	Name	Description	Schema
// Path
// id
// required
// User id
// string
// Path
// realm
// required
// realm name (not id!)
// string
// Body
// rep
// required
// UserRepresentation
// Responses
// HTTP Code	Description	Schema
// default
// success
// Response
// Consumes
// application/json

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