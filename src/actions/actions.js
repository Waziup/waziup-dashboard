import * as types from './actionTypes';
import axios from 'axios'
import util from '../lib/utils.js';
import WaziupApi from 'waziup_api'
import config from '../config.js'

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
var Bearer = defaultClient.authentications['Bearer'];
Bearer.apiKey = "YOUR API KEY"
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
//Bearer.apiKeyPrefix['Authorization'] = "Token"

var api = new WaziupApi.SensorsApi()

function receiveSensors(sensors) {
  return {
    type: types.RECV_SENSORS,
    data: sensors
  }
};

function receiveError(json) {
  return {
    type: types.RECV_ERROR,
    data: json
  }
};

export const fetchSensors = (perms, service, allFlag) => (dispatch) => {

  var domain = "waziup"; 
  
  var callback = function(error, data, response) {
    if (error) {
      dispatch(receiveError(error));
    } else {
      dispatch(receiveSensors(data));
    }
  };
  api.getSensors(domain, null, callback);

};

export function selectFarm(farm) {
  return {
    type: types.SELECT_FARM,
    farm: farm
  }
};

export function createSensor(sensor) {
  return function (dispatch) {
  var domain = "waziup"; 
  
  var callback = function(error, data, response) {
    if (error) {
      dispatch(createSensorError(error));
    } else {
      dispatch(createSensorSuccess(data));
    }
  };
  api.addSensor(sensor, domain, callback);
  }
};

export function createSensorSuccess(json) {
  return {
    type: types.CREATE_SENSOR_SUCCESS,
    data: json
  }
};

export function createSensorError(json) {
  return {
    type: types.CREATE_SENSOR_ERROR,
    data: json
  }
};
export function updateSensorAttributes(sensorId, update, service, servicePath) {
  return function (dispatch) {
    return axios.post('/api/v1/orion/v2/entities/' + sensorId + '/attrs', update, {
      headers: {
        'content-type': 'application/json',
        'fiware-servicepath': servicePath,
        'fiware-service': service,
      }
    })
      .then(function (response) {
        console.log(response);
        //status 204 means OK
        dispatch(updateSensorSuccess(response.data));
      })
      .catch(function (response) {
        console.log(response);
        dispatch(updateSensorError(response.data));
      })
  }
};

export function updateSensorStart(json) {
  return {
    type: types.UPDATE_SENSOR_START,
    data: json
  }
};

export function updateSensorSuccess(json) {
  return {
    type: types.UPDATE_SENSOR_SUCCESS,
    data: json
  }
};

export function updateSensorError(json) {
  return {
    type: types.UPDATE_SENSOR_ERROR,
    data: json
  }
};

export function deleteSensor(sensorId, service, servicePath) {
  return function (dispatch) {
    dispatch({ type: types.DELETE_SENSOR_START });
    return axios.delete('/api/v1/orion/v2/entities/' + sensorId, {
      headers: {
        'content-type': 'application/json',
        'fiware-servicepath': servicePath,
        'fiware-service': service,
      },
    })
      .then(function (response) {
        console.log(response);
        dispatch(deleteSensorSuccess(response.data));
      })
      .catch(function (response) {
        console.log(response);
        dispatch(deleteSensorError(response.data));
      })
  }

};
export function deleteSensorSuccess(json) {
  return {
    type: types.DELETE_SENSOR_SUCCESS,
    data: json
  }
};

export function deleteSensorError(json) {
  return {
    type: types.DELETE_SENSOR_ERROR,
    data: json
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
