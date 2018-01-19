import * as types from './actionTypes';
import axios from 'axios'
import util from '../lib/utils.js';
import WaziupApi from 'waziup_api'
import config from '../config.js'
import {store} from '../index.js'

const settings = {
  baseUrl: 'http://aam.waziup.io/auth',
  username: 'admin',
  password: 'KCadminW',
  grant_type: 'password',
  client_id: 'admin-cli'
};

var defaultClient = WaziupApi.ApiClient.instance;
defaultClient.basePath = config.APIServerUrl + '/v1'

// Configure API key authorization: Bearer
//var Bearer = defaultClient.authentications['Bearer'];
//Bearer.apiKey = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJVU3dXNUFOeTk4ZU5WdzltaXVlUnc4YUFsZktnV1lfTnNndmJxU05ualJJIn0.eyJqdGkiOiJmMDY2MTk4Ni0wYzhiLTQ4ZDItODAwNi00NjExYTRkNDMzN2EiLCJleHAiOjE1MTYzODIxMzgsIm5iZiI6MCwiaWF0IjoxNTE2MzY0MTM4LCJpc3MiOiJodHRwOi8va2V5Y2xvYWs6ODA4MC9hdXRoL3JlYWxtcy93YXppdXAiLCJhdWQiOiJhcGktc2VydmVyIiwic3ViIjoiMmVjZmFlMjQtZjM0MC00YWQwLWExMmUtMDJjZGM2MGNkOGJhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXBpLXNlcnZlciIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6ImE2NjE2ZDc1LTkyMGItNDQxZi1iNTk3LTA2ZWE5OGQxYTAzYyIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsicmVnaXN0ZXJlZF91c2VyIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJmYWNlYm9vayI6InRzdCIsIm5hbWUiOiJ0ZXN0IHRlc3QiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJjZHVwb250IiwiZ2l2ZW5fbmFtZSI6InRlc3QiLCJmYW1pbHlfbmFtZSI6InRlc3QiLCJlbWFpbCI6ImNkdXBvbnRAZmJrLmV1In0.LMdM9AUcrCJ50lUtLdGltF66Tv60cunx6UbwTt7MxNnXHepXIYBenJ8k869vEstn90lb75Lbqh2JK6t17B6uvaCPDZzJdUtjto6RlWYBfDq5PkQ97ms96RX_Eq8nqaqZuxM6Fd5jrJkGgf1k8mhtqdSg7P26T-YLtFh4dQD81AAkaZ7JLUsnQXqtapAhVm1yBTrrpJJ80dyYaTRY5thcsgC88W3wbuBqKfGndj0nYd4dnULMP4I-jDeLFMmjRpyNV3o01ZgIJc3D40TyZc3Cjll0Ioiam0hbKFRAt2BxKgnxqbZWnPMIo0YF0yJzffkfwEkvf_oW5LA9LNyk5pfOZA"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Bearer.apiKeyPrefix['Authorization'] = "Bearer"

var api = new WaziupApi.SensorsApi()


function myCallback(success, error, dispatch) {
  var callback = function(error, data, response) {
    if (error) {
      dispatch({type: error, data: error});
    } else {
      dispatch({type: success, data: data});
    }
  };
  return callback;
}

export function fetchSensors() {
  return function (dispatch) {
    var domain = "waziup"; 
    api.getSensors(domain, null, myCallback(types.RECV_SENSORS, types.RECV_ERROR, dispatch));
    }
};

export function createSensor(sensor) {
  return function (dispatch) {
    var domain = "waziup"; 
    api.addSensor(sensor, domain, myCallback(types.CREATE_SENSOR_SUCCESS, types.CREATE_SENSOR_ERROR, dispatch));
  }
};

export function updateSensorLocation(sensorId, location) {
  return function (dispatch) {
    var domain = "waziup"; 
    api.putSensorLocation(domain, sensorId, location, myCallback(types.UPDATE_SENSOR_SUCCESS, types.UPDATE_SENSOR_ERROR, dispatch));
  }
};

export function updateSensorOwner(sensorId, owner) {
  return function (dispatch) {
    var domain = "waziup"; 
    api.putSensorOwner(domain, sensorId, owner, myCallback(types.UPDATE_SENSOR_SUCCESS, types.UPDATE_SENSOR_ERROR, dispatch));
  }
};

export function deleteSensor(sensorId) {
  return function (dispatch) {
    console.log("store:" +Object.getOwnPropertyNames(store)) 
    console.log("store:" + JSON.stringify(store.getState().keycloak.token))
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    api.deleteSensor(domain, sensorId, myCallback(types.DELETE_SENSOR_SUCCESS, types.DELETE_SENSOR_ERROR, dispatch));
  }
};

export function getUsers(realm) {
  return function (dispatch) {
    return axios.get('/api/v1/kcadmin/user/search/'.concat(realm), {
      headers: {
        'content-type': 'application/json'
      }
    }).then((users) => {
      dispatch(getUsersSuccess(users.data));
    }).catch((err) => {
      dispatch(getUsersError(err));
    });
  }
};

export function deleteUser(realm, userid) {
  return function (dispatch) {
    return axios.delete('/api/v1/kcadmin/user/delete/'.concat(realm).concat('/').concat(userid), {
      headers: {
        'content-type': 'application/json'
      }
    }).
      then((status) => {
        dispatch(deleteUserSuccess(status));
      }).
      catch((err) => {
        dispatch(deleteUserError(err));
      });
  }
};

export function deleteUserSuccess(status) {
  return {
    type: types.DELETE_USER_SUCCESS,
    status: status
  }
};

export function deleteUserError(error) {
  return {
    type: types.DELETE_USER_ERROR,
    error: error
  }
};

export function getUsersSuccess(users) {
  return {
    type: types.GET_USERS_SUCCESS,
    data: users
  }
};

export function getUsersError(json) {
  return {
    type: types.GET_USERS_ERROR,
    data: json
  }
};

export function createSubscription(sub, service, servicePath) {
  return function (dispatch) {
    var url = '/api/v1/orion/v2/subscriptions'
    return axios.post(url, sub, {
      headers: {
        'content-type': 'application/json',
        'fiware-servicepath': servicePath,
        'fiware-service': service,
      },
    })
      .then(function (response) {
        dispatch(createSubscriptionSuccess(response.data));
      })
      .catch(function (response) {
        dispatch(createSubscriptionError(response.data));
      })
  }
};

export function createSubscriptionSuccess(data) {
  return {
    type: types.CREATE_SUBSCRIPTION_SUCCESS,
    data: { json: data }
  }
};

export function createSubscriptionError(json) {
  return {
    type: types.CREATE_SUBSCRIPTION_ERROR,
    data: json
  }
};

export function getNotifications(perms, service, allFlag) {
  return function (dispatch) {
    //const sps = Array.from(util.getViewServicePaths(perms));
    //let a = allFlag ? "/#," : ","
    let allSps = "/#"; //sps.reduce((acc, sp) => acc.concat(sp.concat(sp === '/' ? '#' : a)), '');

    return axios.get('/api/v1/orion/v2/subscriptions', {
      headers: {
        'fiware-servicepath': allSps,
        'fiware-service': service,
      },
    })
      .then(function (response) {
        //console.log("notif succ")
        dispatch(getNotificationsSuccess(response.data));
      })
    // .catch(function(response){
    //   console.log("notif error")
    //   dispatch(getNotificationsError(response.data));
    // })
  }
};

export function getNotificationsSuccess(data) {
  return {
    type: types.GET_NOTIFICATIONS_SUCCESS,
    data: data
  }
};

export function getNotificationsError(json) {
  return {
    type: types.GET_NOTIFICATIONS_ERROR,
    data: json
  }
};
export function deleteNotif(notifId, service, servicePath) {
  return function (dispatch) {
    dispatch({ type: types.DELETE_NOTIF_START });
    return axios.delete('/api/v1/orion/v2/subscriptions/' + notifId, {
      headers: {
        'fiware-servicepath': servicePath,
        'fiware-service': service,
      },
    })
      .then(function (response) {
        console.log(response);
        dispatch(deleteNotifSuccess(response.data));
      })
      .catch(function (response) {
        console.log(response);
        dispatch(deleteNotifError(response.data));
      })
  }

};

export function deleteNotifSuccess(json) {
  return {
    type: types.DELETE_NOTIF_SUCCESS,
    data: json
  }
};

export function deleteNotifError(json) {
  return {
    type: types.DELETE_NOTIF_ERROR,
    data: json
  }
};

export function createRecord(record, service, servicePath) {
  console.log(record);
  return function (dispatch) {
    dispatch({ type: types.CREATE_RECORD_START });
    return axios.post('/api/v1/orion/v2/entities', record, {
      headers: {
        'content-type': 'application/json',
        'fiware-servicepath': servicePath,
        'fiware-service': service,
      },
    })
      .then(function (response) {
        console.log(response);
        dispatch(createRecordSuccess(response.data));
      })
      .catch(function (response) {
        console.log(response);
        dispatch(createRecordError(response.data));
      })
  }

};

export function createRecordSuccess(json) {
  return {
    type: types.CREATE_RECORD_SUCCESS,
    data: json
  }
};

export function createRecordError(json) {
  return {
    type: types.CREATE_RECORD_ERROR,
    data: json
  }
};
