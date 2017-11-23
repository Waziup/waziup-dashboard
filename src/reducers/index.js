import * as types from '../actions/actionTypes';
import { combineReducers } from 'redux'; //might need to remove
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
//import { REHYDRATE } from 'redux-persist/constants'

function sensorListReducer(state = { isLoading: false, sensors: [], allSps: [], error: false, errMsg:'' }, action = null) {
  switch (action.type) {
    case types.RECV_ERROR:
      return Object.assign({}, state, { isLoading: false, errMsg: action.data, error: true });
    case types.RECV_SENSORS:
      const allSps = new Set();
      for (const entry of action.data)
        allSps.add(entry.servicePath.value);

      return Object.assign({}, state, { isLoading: false, sensors: action.data, allSps: allSps, error: false });
    case types.REQ_SENSORS:
      return Object.assign({}, state, { isLoading: true, error: false });
    default:
      return state;
  }
};

function sensorReducer(state = { isLoading: false, sensor: {}, error: false }, action = null) {
  switch (action.type) {
    case types.CREATE_SENSOR_START:
      return Object.assign({}, state, { isLoading: true });
    case types.CREATE_SENSOR_SUCCESS:
      return Object.assign({}, state, { isLoading: false, sensor: action.data, error: false });
    case types.CREATE_SENSOR_ERROR:
      return Object.assign({}, state, { isLoading: false, sensor: { error: action.data }, error: false });
    case types.UPDATE_SENSOR_START:
      return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_SENSOR_SUCCESS:
      return Object.assign({}, state, { isLoading: false, sensor: action.data, error: false });
    case types.DELETE_SENSOR_START:
      return Object.assign({}, state, { isLoading: true });
    case types.DELETE_SENSOR_SUCCESS:
      return Object.assign({}, state, { isLoading: false, sensor: {}, error: false });
    default:
      return state;
  }
};

function historicalReducer(state = { isLoading: false, data: {}, error: false }, action = null) {
  switch (action.type) {
    case types.GET_HISTORICAL_START:
      return Object.assign({}, state, { isLoading: true });
    case types.GET_HISTORICAL_SUCCESS:
      return Object.assign({}, state, {
        isLoading: false, data: {
          ...state.data,
          [action.data.measurementId]: action.data.json
        }, error: false
      });
    case types.GET_HISTORICAL_ERROR:
      return Object.assign({}, state, { isLoading: false, data: { error: action.data }, error: false });
    default:
      return state;
  }
};

function userReducer(state = { isLoading: false, currentUser: {}, error: false }, action = null) {
  switch (action.type) {
    case types.UPDATE_USER_START:
      return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, { isLoading: false, currentUser: action.data, error: false });
    case types.UPDATE_USER_ERROR:
      return Object.assign({}, state, { isLoading: false, currentUser: { error: action.data }, error: false });
    default:
      return state;
  }
};

function usersListReducer(state = { isLoading: false, users: {}, error: false }, action = null) {
  switch (action.type) {
    case types.GET_USERS_START:
      return Object.assign({}, state, { isLoading: true });
    case types.GET_USERS_SUCCESS:
      return Object.assign({}, state, { isLoading: false, users: action.data, error: false });
    case types.GET_USERS_ERROR:
      return Object.assign({}, state, { isLoading: false, users: { error: action.data }, error: true });
    default:
      return state;
  }
};

function notificationsReducer(state = { isLoading: false, data: {}, error: false }, action = null) {
  switch (action.type) {
    case types.GET_NOTIFICATIONS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_NOTIFICATIONS_SUCCESS: return Object.assign({}, state, { isLoading: false, notifications: action.data, error: false });
    case types.GET_NOTIFICATIONS_ERROR: return Object.assign({}, state, { isLoading: false, notifications: { error: action.data }, error: false });
    default: return state;
  }
};

function recordReducer(state = { isLoading: false, record: {}, error: false }, action = null) {
  switch (action.type) {
    case types.CREATE_RECORD_START:
      return Object.assign({}, state, { isLoading: true });
    case types.CREATE_RECORD_SUCCESS:
      return Object.assign({}, state, { isLoading: false, record: action.data, error: false });
    //case types.UPDATE_RECORD_START:
    //  return Object.assign({}, state, {isLoading: false, record: action.data, error: false });
    case types.CREATE_RECORD_ERROR:
      return Object.assign({}, state, { isLoading: false, record: { error: action.data }, error: false });
    default:
      return state;
  }
};

function farmReducer(state = { farm: {} }, action = null) {
  switch (action.type) {
    case types.SELECT_FARM:
      return Object.assign({}, state, { farm: action.farm });
    default:
      return state;
  }
};



/*
function myReducer(state = {}, action = null) {
  switch (action) {
    case REHYDRATE:
      var incoming = action.payload.myReducer
      if (incoming) 
        return { ...state, ...incoming, specialKey: processSpecial(incoming.specialKey) }
      return state
    default:
      return state;
  }
}  myReducer: myReducer,
*/

const rootReducer = combineReducers({
  routing: routerReducer,
  //List of sensors
  sensors: sensorListReducer,
  //Sensor CRUD operations
  sensor: sensorReducer,
  users: usersListReducer,
  record: recordReducer,
  notifications: notificationsReducer,
  form: formReducer,
  farm: farmReducer,
  keycloak: (state = {}) => state
});

export { rootReducer, routerReducer }
