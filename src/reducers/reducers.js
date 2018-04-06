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

//Get sensors values
function valuesReducer(state = { isLoading: false, values: [], error: false, errMsg:'' }, action = null) {
  switch (action.type) {
    case types.GET_VALUES_START:   return Object.assign({}, state, { isLoading: true, error: false });
    case types.GET_VALUES_SUCCESS: return Object.assign({}, state, { isLoading: false, values: action.data, error: false });
    case types.GET_VALUES_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data,     error: true });
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
function userReducer(state = { isLoading: false, user: {}, error: false }, action = null) {
  switch (action.type) {
    case types.GET_USER_START:   return Object.assign({}, state, { isLoading: true });
    case types.GET_USER_SUCCESS: return Object.assign({}, state, { isLoading: false, user: action.data, error: false });
    case types.GET_USER_ERROR:   return Object.assign({}, state, { isLoading: false, user: action.data, error: true });
    default: return state;
  }
};

function notificationsReducer(state = { isLoading: false, notifications: [], error: false }, action = null) {
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
  var msg, error = null;
  switch (action.type) {
    case types.CLEAR_MESSAGES:        return []
    //positive messages
    case types.CREATE_SENSOR_SUCCESS: msg="Sensor created";       error= false; break;
    case types.UPDATE_SENSOR_SUCCESS: msg="Sensor updated";       error= false; break;
    case types.DELETE_SENSOR_SUCCESS: msg="Sensor deleted";       error= false; break;
    case types.CREATE_NOTIF_SUCCESS:  msg="Notification created"; error= false; break;
    case types.UPDATE_NOTIF_SUCCESS:  msg="Notification updated"; error= false; break;
    case types.DELETE_NOTIF_SUCCESS:  msg="Notification deleted"; error= false; break;
    case types.CREATE_USER_SUCCESS:   msg="New user created";     error= false; break;
    case types.UPDATE_USER_SUCCESS:   msg="User updated";         error= false; break;
    case types.DELETE_USER_SUCCESS:   msg="User deleted";         error= false; break;

    //error cases
    case types.GET_SENSORS_ERROR:     msg="Error when fetching sensors";       error= true; break; 
    case types.CREATE_SENSOR_ERROR:   msg="Error when creating sensor";        error= true; break;
    case types.UPDATE_SENSOR_ERROR:   msg="Error when updating sensor";        error= true; break; 
    case types.DELETE_SENSOR_ERROR:   msg="Error when deleting sensor";        error= true; break; 
    case types.GET_VALUES_ERROR:      msg="Error when fetching sensor values"; error= true; break;
    case types.GET_NOTIFS_ERROR:      msg="Error when fetching notifications"; error= true; break;
    case types.CREATE_NOTIF_ERROR:    msg="Error when creating notification";  error= true; break; 
    case types.UPDATE_NOTIF_ERROR:    msg="Error when updating notification";  error= true; break; 
    case types.DELETE_NOTIF_ERROR:    msg="Error when deleting notification";  error= true; break; 
    case types.GET_USERS_ERROR:       msg="Error when fetching users";         error= true; break;
    case types.GET_USER_ERROR:        msg="Error when fetching user infos";    error= true; break;
    case types.CREATE_USER_ERROR:     msg="Error when creating user";          error= true; break; 
    case types.UPDATE_USER_ERROR:     msg="Error when updating user";          error= true; break; 
    case types.DELETE_USER_ERROR:     msg="Error when deleting user";          error= true; break; 

    default: return state;
  }
  if(error) {
    var errorContext = null
    if(action.data.response) {
       errorContext = action.data.response.status + " " + action.data.response.body.description
    } else {
      errorContext = "Client error. Please check web console for details."
      console.error("client error: " + action.data) 
    }
    return [ ...state, {msg: msg + ": " + errorContext, error: true}]
  } else {
    return [ ...state, {msg: msg, error: false}]
  }
};

// Get all permissions
function permissionsReducer(state = { isLoading: false, permissions: [], error: false }, action = null) {
  switch (action.type) {
    case types.GET_PERMS_START:   return Object.assign({}, state, { isLoading: true });
    case types.GET_PERMS_SUCCESS: return Object.assign({}, state, { isLoading: false, permissions: action.data, error: false });
    case types.GET_PERMS_ERROR:   return Object.assign({}, state, { isLoading: false, msg: action.data,   error: true });
    default: return state;
  }
};

export default function rootReducer(state = {}, action) {
  return {
    routing: routerReducer(state.routing, action),
    keycloak: state.keycloak,
    //list of sensors
    sensors: sensorsReducer(state.sensors, action),
    //Sensor CRUD operations
    sensorAction: sensorActionReducer(state.sensorAction, action),
    //Sensor values
    values: valuesReducer(state.values, action),
    //current user
    user: userReducer(state.user, action),
    //list of users
    users: usersReducer(state.users, action),
    //list of notifications
    notifications: notificationsReducer(state.notifications, action),
    //Notif CRUD operations
    notifAction: notifActionReducer(state.notifAction, action),
    //global messages
    messages: messagesReducer(state.messages, action),
    //list of permissions
    permissions: permissionsReducer(state.permissions, action)
  }
}

