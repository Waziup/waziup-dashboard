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
function sensorReducer(state = { isLoading: false, msg:{}, error: false }, action = null) {
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
function usersReducer(state = { isLoading: false, users: {}, error: false }, action = null) {
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

const rootReducer = combineReducers({
  routing: routerReducer,
  //list of sensors
  sensors: sensorsReducer,
  //Sensor CRUD operations
  sensorActionResult: sensorReducer,
  //list of users
  users: usersReducer,
  //list of notifications
  notifications: notificationsReducer,
  keycloak: (state = {}) => state
});

export { rootReducer, routerReducer }
