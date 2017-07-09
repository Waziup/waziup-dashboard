import * as types from '../actions/actionTypes';
import { combineReducers } from 'redux'; //might need to remove
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'

function sensorListReducer(state = {isLoading: false, data: [], error: false},action = null) {
      switch(action.type) {
              case types.RECV_ERROR:
                return Object.assign({}, state, {isLoading: false, sensors: action.data, error: true});
              case types.RECV_SENSORS: 
                return Object.assign({}, state, {isLoading: false, sensors: action.data, error: false });
              case types.REQ_SENSORS:
                return Object.assign({}, state, {isLoading: true, error: false });
              default:
                return state;
            }
  };

function sensorsReducer(state = {isLoading: false, sensor: {}, error: false},action = null) {
      switch(action.type) {
              case types.CREATE_SENSORS_START:
                return Object.assign({}, state, {isLoading: true});
              case types.CREATE_SENSORS_SUCCESS:
                return Object.assign({}, state, {isLoading: false, sensor: action.data, error: false });
              case types.UPDATE_SENSORS_START:
                return Object.assign({}, state, {isLoading: false, sensor: action.data, error: false });
              case types.CREATE_SENSORS_ERROR:
                return Object.assign({}, state, {isLoading: false, sensor:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function historicalReducer(state = {isLoading: false, data: {}, error: false},action = null) {
      switch(action.type) {
              case types.GET_HISTORICAL_START:
                return Object.assign({}, state, {isLoading: true});
              case types.GET_HISTORICAL_SUCCESS:
              return Object.assign({}, state, {isLoading: false, data:{
                ...state.data,
                [action.data.measurementId] : action.data.json
              } , error: false });
              case types.GET_HISTORICAL_ERROR:
                return Object.assign({}, state, {isLoading: false, data:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function userReducer(state = {isLoading: false, currentUser: {}, error: false},action = null) {
      switch(action.type) {
              case types.UPDATE_USER_START:
                return Object.assign({}, state, {isLoading: true});
              case types.UPDATE_USER_SUCCESS:
                return Object.assign({}, state, {isLoading: false, currentUser: action.data, error: false });
              case types.UPDATE_USER_ERROR:
                return Object.assign({}, state, {isLoading: false, currentUser:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function usersListReducer(state = {isLoading: false, users: {}, error: false},action = null) {
      switch(action.type) {
              case types.GET_USERS_START:
                return Object.assign({}, state, {isLoading: true});
              case types.GET_USERS_SUCCESS:
                return Object.assign({}, state, {isLoading: false, users: action.data, error: false });
              case types.GET_USERS_ERROR:
                return Object.assign({}, state, {isLoading: false, users:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function adminReducer(state = {isLoading: false, adminUser: {}, error: false},action = null) {
      switch(action.type) {
              case types.ADMIN_LOGIN:
                return Object.assign({}, state, {isLoading: true});
              case types.ADMIN_LOGIN_SUCCESS:
                return Object.assign({}, state, {isLoading: false, adminUser: action.data, error: false });
              case types.ADMIN_LOGIN_ERROR:
                return Object.assign({}, state, {isLoading: false, adminUser:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function sensorCRUDReducer(state = {isLoading: false, sensorEntity: {}, error: false},action = null) {
      switch(action.type) {
              case types.DELETE_SENSORS_START:
                return Object.assign({}, state, {isLoading: true});
              case types.DELETE_SENSORS_SUCCESS:
                return Object.assign({}, state, {isLoading: false, sensorEntity: action.data, error: false });
              case types.DELETE_SENSORS_ERROR:
                return Object.assign({}, state, {isLoading: false, sensorEntity:{error:action.data}, error: false });
              default:
                return state;
            }
  };

function notificationsReducer(state = {isLoading: false, data: {}, error: false}, action = null) {
   switch(action.type) {
      case types.GET_NOTIFICATIONS_START:     return Object.assign({}, state, {isLoading: true});
      case types.GET_NOTIFICATIONS_SUCCESS:   return Object.assign({}, state, {isLoading: false, notifications: action.data, error: false });
      case types.GET_NOTIFICATIONS_ERROR:     return Object.assign({}, state, {isLoading: false, notifications: { error:action.data},  error: false });
      default: return state;
   }
};

const rootReducer = combineReducers({
    routing: routerReducer,
    sensors: sensorListReducer,
    sensor: sensorsReducer,
    sensorEntity: sensorCRUDReducer,
    currentUser: userReducer,
    users:usersListReducer,
    admin:adminReducer,
    historical:historicalReducer,
    notifications: notificationsReducer,
    form: formReducer,
    keycloak:(state={})=>state
});

export default rootReducer;
