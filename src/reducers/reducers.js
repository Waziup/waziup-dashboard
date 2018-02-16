import * as types from '../actions/actionTypes';
import { combineReducers } from 'redux'; //might need to remove
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

//Get all sensors
function sensorsReducer(state = { isLoading: false, sensors: [], error: false, errMsg:'' }, action = null) {
  switch (action.type) {
    case types.GET_SENSORS_START:   return Object.assign({}, state, { isLoading: true, error: false });
    case types.GET_SENSORS_SUCCESS: return Object.assign({}, state, { isLoading: false, sensors: action.data, error: false });
    case types.GET_SENSORS_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data,     error: true });
    default: return state;
  }
};

//Actions on one sensor
function sensorActionReducer(state = { isLoading: false, msg:{}, error: false }, action = null) {
  switch (action.type) {
    case types.CREATE_SENSOR_START:    return Object.assign({}, state, { isLoading: true });
    case types.CREATE_SENSOR_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.CREATE_SENSOR_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    case types.UPDATE_SENSOR_START:    return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_SENSOR_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.UPDATE_SENSOR_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    case types.DELETE_SENSOR_START:    return Object.assign({}, state, { isLoading: true });
    case types.DELETE_SENSOR_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.DELETE_SENSOR_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    default: return state;
  }
};

// Get all users
function usersReducer(state = { isLoading: false, users: [], error: false }, action = null) {
  switch (action.type) {
    case types.GET_USERS_START:   return Object.assign({}, state, { isLoading: true });
    case types.GET_USERS_SUCCESS: return Object.assign({}, state, { isLoading: false, users: action.data, error: false });
    case types.GET_USERS_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data,   error: true });
    default: return state;
  }
};

// actions on one user
function userReducer(state = { isLoading: false, msg: {}, error: false }, action = null) {
  switch (action.type) {
    case types.UPDATE_USER_START:   return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_USER_SUCCESS: return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.UPDATE_USER_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    default: return state;
  }
};

function notificationsReducer(state = { isLoading: false, notifications: {}, error: false }, action = null) {
  switch (action.type) {
    case types.GET_NOTIFS_START:   return Object.assign({}, state, { isLoading: true });
    case types.GET_NOTIFS_SUCCESS: return Object.assign({}, state, { isLoading: false, notifications: action.data, error: false });
    case types.GET_NOTIFS_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data,           error: true });
    default: return state;
  }
};

//Actions on one sensor
function notifActionReducer(state = { isLoading: false, msg:{}, error: false }, action = null) {
  switch (action.type) {
    case types.CREATE_NOTIF_START:    return Object.assign({}, state, { isLoading: true });
    case types.CREATE_NOTIF_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.CREATE_NOTIF_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    case types.UPDATE_NOTIF_START:    return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_NOTIF_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.UPDATE_NOTIF_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    case types.DELETE_NOTIF_START:    return Object.assign({}, state, { isLoading: true });
    case types.DELETE_NOTIF_SUCCESS:  return Object.assign({}, state, { isLoading: false, msg: action.data, error: false });
    case types.DELETE_NOTIF_ERROR:    return Object.assign({}, state, { isLoading: false, msg: action.data, error: true });
    default: return state;
  }
};

function messagesReducer(state = [], action = null) {
  console.log("message action" + JSON.stringify(action))
  switch (action.type) {
    case types.CLEAR_MESSAGES:        return []
    //Sensor messages
    case types.GET_SENSORS_ERROR:     return [ ...state, {msg:"Error when fetching sensors: " + action.data.response.status + " " + action.data.response.body.description, error: true}]
    case types.CREATE_SENSOR_SUCCESS: return [ ...state, {msg:"Sensor created",  error: false}]
    case types.CREATE_SENSOR_ERROR:   return [ ...state, {msg:"Error when creating sensor: " + action.data.response.status + " " + action.data.response.body.description, error: true}]
    case types.UPDATE_SENSOR_SUCCESS: return [ ...state, {msg:"Sensor updated", error: false}]
    case types.UPDATE_SENSOR_ERROR:   return [ ...state, {msg:"Error when updating sensor: " + action.data.response.status + " " + action.data.response.statusText, error: true}] 
    case types.DELETE_SENSOR_SUCCESS: return [ ...state, {msg:"Sensor deleted", error: false}]
    case types.DELETE_SENSOR_ERROR:   return [ ...state, {msg:"Error when deleting sensor: " + action.data.response.status + " " + action.data.response.body.description,  error: true}] 
    //Notif messages
    case types.GET_NOTIFS_ERROR:      return [ ...state, {msg:"Error when fetching notifications: ",    error: true}]
    case types.CREATE_NOTIF_SUCCESS:  return [ ...state, {msg:"Notification created", error: false}] 
    case types.CREATE_NOTIF_ERROR:    return [ ...state, {msg:"Error when creating notification:" + action.data.response.status + " " + action.data.response.body.description, error: false}] 
    case types.UPDATE_NOTIF_SUCCESS:  return [ ...state, {msg:"Notification updated", error: false}] 
    case types.UPDATE_NOTIF_ERROR:    return [ ...state, {msg:"Error when updating notification:" + action.data.response.status + " " + action.data.response.body.description, error: false}] 
    case types.DELETE_NOTIF_SUCCESS:  return [ ...state, {msg:"Notification deleted", error: false}] 
    case types.DELETE_NOTIF_ERROR:    return [ ...state, {msg:"Error when deleting notification:" + action.data.response.status + " " + action.data.response.body.description, error: false}] 

    default: return state;
  }
};

export default function rootReducer(state = {}, action) {
  return {
  routing: routerReducer(state.routing, action),
  //list of sensors
  sensors: sensorsReducer(state.sensors, action),
  //Sensor CRUD operations
  sensorAction: sensorActionReducer(state.sensorAction, action),
  //list of users
  users: usersReducer(state.users, action),
  //list of notifications
  notifications: notificationsReducer(state.notifications, action),
  //Notif CRUD operations
  notifAction: notifActionReducer(state.notifAction, action),
  //global errors
  messages: messagesReducer(state.messages, action),
  keycloak: state.keycloak
  }
}

