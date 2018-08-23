import * as types from './actionTypes';
import util from '../lib/utils.js';
import * as WaziupApi from 'waziup-js'
import config from '../config.js'
import {store} from '../index.js'

var defaultClient = WaziupApi.ApiClient.instance;
defaultClient.basePath = config.APIServerUrl + '/v1'

var sensorsApi = new WaziupApi.SensorsApi();
var usersApi   = new WaziupApi.UsersApi();
var notifsApi  = new WaziupApi.NotificationsApi();
var authApi    = new WaziupApi.AuthApi();


/* Sensor Actions */

export function getSensors(params) {
  return async function (dispatch) {
    var domain = "waziup";
    if(!params) {
      params = {limit: 1000}
    }
    dispatch({type: types.GET_SENSORS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.getSensors(domain, params)
      dispatch({type: types.GET_SENSORS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_SENSORS_ERROR, data: error});
    }
  }
};

export function createSensor(sensor) {
  return async function (dispatch) {
    var domain = "waziup"; 
    dispatch({type: types.CREATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.createSensor(domain, sensor);
      dispatch({type: types.CREATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors({limit:1000}));
    } catch (error) {
      dispatch({type: types.CREATE_SENSOR_ERROR, data: error});
    }
  }
};

export function getSensor(id) {
  return async function (dispatch) {
    var domain = "waziup";
    dispatch({type: types.GET_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.getSensor(domain, id)
      dispatch({type: types.GET_SENSOR_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_SENSOR_ERROR, data: error});
    }
  }
};

export function updateSensorLocation(sensorId, location) {
  return async function (dispatch) {
    var domain = "waziup"; 
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.putSensorLocation(domain, sensorId, location)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function updateSensorOwner(sensorId, owner) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.putSensorOwner(domain, sensorId, owner)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function updateSensorName(sensorId, name) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.putSensorName(domain, sensorId, name)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function updateSensorGatewayId(sensorId, gateway_id) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.putSensorGatewayId(domain, sensorId, gateway_id)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function deleteSensor(sensorId) {
  return async function (dispatch) {
    dispatch({type: types.DELETE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.deleteSensor(domain, sensorId)
      dispatch({type: types.DELETE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.DELETE_SENSOR_ERROR, data: error});
    }
  }
};

/* Measurement actions */

export function addMeasurement(sensorId, meas) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.addMeasurement(domain, sensorId, meas)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function deleteMeasurement(sensorId, measId) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.deleteMeasurement(domain, sensorId, measId)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

export function updateMeasurementName(sensorId, measId, name) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.putMeasurementName(domain, sensorId, measId, name)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR, data: error});
    }
  }
};

/* sensor values action */

export function getValues(sensorId, measId, domain, options) {
  return async function (dispatch) {
    dispatch({type: types.GET_VALUES_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.getMeasurementValues(domain, sensorId, measId, options)
      dispatch({type: types.GET_VALUES_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_VALUES_ERROR, data: error});
    }
  }
};



/* User actions */

export function getUsers() {
  return async function (dispatch) {
    dispatch({type: types.GET_USERS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await usersApi.getUsers(domain)
      dispatch({type: types.GET_USERS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_USERS_ERROR, data: error});
    }
  }
};

export function getUser(id) {
  return async function (dispatch) {
    dispatch({type: types.GET_USER_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await usersApi.getUser(domain, id)
      dispatch({type: types.GET_USER_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_USER_ERROR, data: error});
    }
  }
};

export function updateUser(userid, user) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_USER_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await usersApi.updateUser(domain, userid, user)
      dispatch({type: types.UPDATE_USER_SUCCESS, data: data})
      dispatch(getUsers());
    } catch (error) {
      dispatch({type: types.UPDATE_USER_ERROR, data: error});
    }
  }
};

export function deleteUser(userid) {
  return async function (dispatch) {
    dispatch({type: types.DELETE_USER_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await usersApi.deleteUsers(domain, userid)
      dispatch({type: types.DELETE_USER_SUCCESS, data: data})
      dispatch(getUsers());
    } catch (error) {
      dispatch({type: types.DELETE_USER_ERROR, data: error});
    }
  }
};

/* Notification actions */

export function getNotifs() {
  return async function (dispatch) {
    dispatch({type: types.GET_NOTIFS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await notifsApi.getNotifications(domain)
      dispatch({type: types.GET_NOTIFS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_NOTIFS_ERROR, data: error});
    }
  }
};

export function createNotif(notif) {
  return async function (dispatch) {
    dispatch({type: types.CREATE_NOTIF_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await notifsApi.createNotification(domain, notif)
      dispatch({type: types.CREATE_NOTIF_SUCCESS, data: data})
      dispatch(getNotifs());
    } catch (error) {
      dispatch({type: types.CREATE_NOTIF_ERROR, data: error});
    }
  }
};

export function deleteNotif(notifId) {
  return async function (dispatch) {
    dispatch({type: types.DELETE_NOTIF_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await notifsApi.deleteNotification(domain, notifId)
      dispatch({type: types.DELETE_NOTIF_SUCCESS, data: data})
      dispatch(getNotifs());
    } catch (error) {
      dispatch({type: types.DELETE_NOTIF_ERROR, data: error});
    }
  }
};

export function clearMessages() {
  return async function (dispatch) {
    dispatch({type: types.CLEAR_MESSAGES});
  }
};

export function getPermissions() {
  return async function (dispatch) {
    var domain = "waziup";
    dispatch({type: types.GET_PERMS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await authApi.getPermissions(domain, null)
      dispatch({type: types.GET_PERMS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_PERMS_ERROR, data: error});
    }
  }
};
