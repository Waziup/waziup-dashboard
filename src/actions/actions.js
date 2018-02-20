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


export function getSensors() {
  return async function (dispatch) {
    var domain = "waziup";
    dispatch({type: types.GET_SENSORS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    try {
      let data = await sensorsApi.getSensors(domain, null)
      dispatch({type: types.GET_SENSORS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_SENSORS_ERROR,   data: error});
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
      dispatch(getSensors());
    } catch (error) {
      console.log("create sensor error")
      dispatch({type: types.CREATE_SENSOR_ERROR,   data: error});
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
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
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
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
    }
  }
};

export function updateSensorName(sensorId, name) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      console.log("error id:" + sensorId + " " + name)
      let data = await sensorsApi.putSensorName(domain, sensorId, name)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      //log.warn("error:" + JSON.stringify(error))
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
    }
  }
};

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
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
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
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
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
      dispatch({type: types.DELETE_SENSOR_ERROR,   data: error});
    }
  }
};

export function updateMeasurementName(sensorId, measId, name) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      console.log("error id:" + sensorId + " " + name)
      let data = await sensorsApi.putMeasurementName(domain, sensorId, measId, name)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
      dispatch(getSensors());
    } catch (error) {
      //log.warn("error:" + JSON.stringify(error))
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
    }
  }
};

export function getUsers() {
  return async function (dispatch) {
    dispatch({type: types.GET_USERS_START});
    var domain = "waziup"; 
    try {
      let data = await usersApi.getUsers(domain)
      dispatch({type: types.GET_USERS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_USERS_ERROR,   data: error});
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
    } catch (error) {
      dispatch({type: types.DELETE_USER_ERROR,   data: error});
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
    } catch (error) {
      dispatch({type: types.CREATE_NOTIF_ERROR,   data: error});
    }
  }
};

export function getNotifs() {
  return async function (dispatch) {
    dispatch({type: types.GET_NOTIFS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    try {
      let data = await notifsApi.getNotifications(domain)
      dispatch({type: types.GET_NOTIFS_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.GET_NOTIFS_ERROR,   data: error});
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
    } catch (error) {
      dispatch({type: types.DELETE_NOTIF_ERROR,   data: error});
    }
  }
};

export function clearMessages() {
  return async function (dispatch) {
    dispatch({type: types.CLEAR_MESSAGES});
  }
};
