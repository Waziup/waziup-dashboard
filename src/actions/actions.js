import * as types from './actionTypes';
import axios from 'axios'
import util from '../lib/utils.js';
import * as WaziupApi from 'waziup-js'
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

var sensorsApi = new WaziupApi.SensorsApi();
var usersApi   = new WaziupApi.UsersApi();
var notifsApi  = new WaziupApi.NotificationsApi();


export function getSensors() {
  return async function (dispatch) {
    var domain = "waziup";
    dispatch({type: types.GET_SENSORS_START});
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
    try {
      let data = await sensorsApi.createSensor(sensor, domain);
      dispatch({type: types.CREATE_SENSOR_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.CREATE_SENSOR_ERROR,   data: error});
    }
  }
};

export function updateSensorLocation(sensorId, location) {
  return async function (dispatch) {
    var domain = "waziup"; 
    dispatch({type: types.UPDATE_SENSOR_START});
    try {
      let data = await sensorsApi.putSensorLocation(domain, sensorId, location)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.UPDATE_SENSOR_ERROR,   data: error});
    }
  }
};

export function updateSensorOwner(sensorId, owner) {
  return async function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    var domain = "waziup"; 
    try {
      let data = await sensorsApi.putSensorOwner(domain, sensorId, owner)
      dispatch({type: types.UPDATE_SENSOR_SUCCESS, data: data})
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
    } catch (error) {
      dispatch({type: types.DELETE_SENSOR_ERROR,   data: error});
    }
  }
};

export function getUsers() {
  return async function (dispatch) {
    dispatch({type: types.GET_USERS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
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
    var domain = "waziup"; 
    try {
      let data = await notifsApi.deleteNotification(domain, notifId)
      dispatch({type: types.DELETE_NOTIF_SUCCESS, data: data})
    } catch (error) {
      dispatch({type: types.DELETE_NOTIF_ERROR,   data: error});
    }
  }
};
