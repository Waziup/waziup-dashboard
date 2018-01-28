import * as types from './actionTypes';
import axios from 'axios'
import util from '../lib/utils.js';
import * as WaziupApi from 'waziup_api'
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


function myCallback(actionSuccess, actionError, dispatch) {
  var callback = function(error, data, response) {
    if (error) {
      console.log("Action error: " + data)
      dispatch({type: actionError, data: data});
    } else {
      dispatch({type: actionSuccess, data: data});
    }
  };
  return callback;
}

export function getSensors() {
  return function (dispatch) {
    var domain = "waziup";
    dispatch({type: types.GET_SENSORS_START});
    sensorsApi.getSensors(domain, null, myCallback(types.GET_SENSORS_SUCCESS, types.GET_SENSORS_ERROR, dispatch));
    }
};

export function createSensor(sensor) {
  return function (dispatch) {
    var domain = "waziup"; 
    dispatch({type: types.CREATE_SENSOR_START});
    sensorsApi.addSensor(sensor, domain, myCallback(types.CREATE_SENSOR_SUCCESS, types.CREATE_SENSOR_ERROR, dispatch));
  }
};

export function updateSensorLocation(sensorId, location) {
  return function (dispatch) {
    var domain = "waziup"; 
    dispatch({type: types.UPDATE_SENSOR_START});
    sensorsApi.putSensorLocation(domain, sensorId, location, myCallback(types.UPDATE_SENSOR_SUCCESS, types.UPDATE_SENSOR_ERROR, dispatch));
  }
};

export function updateSensorOwner(sensorId, owner) {
  return function (dispatch) {
    dispatch({type: types.UPDATE_SENSOR_START});
    var domain = "waziup"; 
    sensorsApi.putSensorOwner(domain, sensorId, owner, myCallback(types.UPDATE_SENSOR_SUCCESS, types.UPDATE_SENSOR_ERROR, dispatch));
  }
};

export function deleteSensor(sensorId) {
  return function (dispatch) {
    dispatch({type: types.DELETE_SENSOR_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    sensorsApi.deleteSensor(domain, sensorId, myCallback(types.DELETE_SENSOR_SUCCESS, types.DELETE_SENSOR_ERROR, dispatch));
  }
};

export function getUsers() {
  return function (dispatch) {
    dispatch({type: types.GET_USERS_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    usersApi.getUsers(domain, myCallback(types.GET_USERS_SUCCESS, types.GET_USERS_ERROR, dispatch));
  }
};

export function deleteUser(userid) {
  return function (dispatch) {
    dispatch({type: types.DELETE_USER_START});
    defaultClient.authentications['Bearer'].apiKey = "Bearer " + store.getState().keycloak.token
    var domain = "waziup"; 
    usersApi.deleteUser(domain, userid, myCallback(types.DELETE_USER_SUCCESS, types.DELETE_USER_ERROR, dispatch));
  }
};

export function createNotif(notif) {
  return function (dispatch) {
    dispatch({type: types.CREATE_NOTIF_START});
    var domain = "waziup"; 
    notifsApi.createNotification(domain, notif, myCallback(types.CREATE_NOTIF_SUCCESS, types.CREATE_NOTIF_ERROR, dispatch));
  }
};

export function getNotifs() {
  return function (dispatch) {
    dispatch({type: types.GET_NOTIFS_START});
    var domain = "waziup"; 
    notifsApi.getNotifications(domain, myCallback(types.GET_NOTIFS_SUCCESS, types.GET_NOTIFS_ERROR, dispatch));
  }
};

export function deleteNotif(notifId) {
  return function (dispatch) {
    dispatch({type: types.DELETE_NOTIF_START});
    var domain = "waziup"; 
    notifsApi.deleteNotification(domain, notifId, myCallback(types.DELETE_NOTIF_SUCCESS, types.DELETE_NOTIF_ERROR, dispatch));
  }
};
