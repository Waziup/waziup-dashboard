import * as types from './actionTypes';
import axios from 'axios'
import adminClient from 'keycloak-admin-client'
const settings = {
  baseUrl: process.env.REACT_APP_KC_URL,
  username: process.env.REACT_APP_ADMIN_USER,
  password: process.env.REACT_APP_ADMIN_PASS,
  grant_type: 'password',
  client_id: 'admin-cli'
};

const fiwareService = 'waziup'
const fiwareServicePath = '/'
const fiwareServicePathQuery = '/#'

function requestSensors() {
    return {type: types.REQ_SENSORS}
};

function requestData() {
    return {type: types.REQ_DATA}
};

function receiveSensors(json) {
    return{
          type: types.RECV_SENSORS,
          data: json
        }
};

function receiveData(json) {
    return{
          type: types.RECV_DATA,
          data: json
        }
};

function receiveError(json) {
    return {
          type: types.RECV_ERROR,
          data: json
        }
};

  /*export function fetchData() {
    return function(dispatch) {
          dispatch(requestData());
          const querystring = require('query-string');
          var url='http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/Device_6/attributes/temperature';
          return axios.get(url,
                           {
                             params: {'lastN': '10'},
                             headers: {
                               'Fiware-ServicePath':"/FL",
                               'Fiware-Service':"waziup",
                               "Accept": "application/json"
                             }
                           })
            .then(function(response) {
              dispatch(receiveData(response.data));
            })
            .catch(function(response){
              dispatch(receiveError(response.data));
            })
        }
};*/

export function fetchSensors(servicePath) {
    if (!servicePath) {servicePath = fiwareServicePath;}
    return function(dispatch) {
          dispatch(requestSensors());
          const querystring = require('query-string');
          return axios.get('http://orion.waziup.io/v1/data/entities',
                           {
                             params: {'limit': '100', 'attrs': 'dateModified,dateCreated,servicePath,*'},
                             headers: {
                               'Fiware-ServicePath':servicePath,
                               'Fiware-Service':fiwareService,
                             }
                           })
            .then(function(response) {
              dispatch(receiveSensors(response.data));
            })
            .catch(function(response){
              dispatch(receiveError(response.data));
            })
        }
};
export function getHistoData(sensor,measurement) {
    return function(dispatch) {
          var url='http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/Device_6/attributes/temperature';
          return axios.get(url,{
                      params: {'lastN': '10'},
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':'/FL',
                        'fiware-service':fiwareService,
                      },
                  })
            .then(function(response) {
              dispatch(getHistoDataSuccess(response.data));
            })
            .catch(function(response){
              dispatch(getHistoDataError(response.data));
            })
        }
};

export function getHistoDataSuccess(json) {
    return{
          type: types.GET_HISTORICAL_SUCCESS,
          data: json
    }
};

export function getHistoDataError(json) {
    return {
          type: types.GET_HISTORICAL_ERROR,
          data: json
        }
};


export function createSensor(sensor,servicePath) {
    return function(dispatch) {
          dispatch({type: types.CREATE_SENSORS_START});
          return axios.post('http://orion.waziup.io/v1/data/entities',sensor,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':servicePath,
                        'fiware-service':fiwareService,
                      },
                  })
            .then(function(response) {
                console.log(response);
              dispatch(createSensorSuccess(response.data));
            })
            .catch(function(response){
                console.log(response);
              dispatch(createSensorError(response.data));
            })
        }

};

export function createSensorSuccess(json) {
    return{
          type: types.CREATE_SENSORS_SUCCESS,
          data: json
        }
};

export function createSensorError(json) {
    return {
          type: types.CREATE_SENSORS_ERROR,
          data: json
        }
};

export function updateSensorStart(json) {
    return{
          type: types.UPDATE_SENSORS_START,
          data: json
        }
};
export function updateSensorLocation(sensor,servicePath) {
    return function(dispatch) {
          return axios.put('http://orion.waziup.io/v1/data/entities/'+sensor.id+'/attrs',sensor.update,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':servicePath,
                        'fiware-service':fiwareService,
                      }
                  })
            .then(function(response) {
                console.log(response);
              dispatch(deleteSensorSuccess(response.data));
            })
            .catch(function(response){
                console.log(response);
              dispatch(deleteSensorError(response.data));
            })
        }

};
export function updateSensorSuccess(json) {
    return{
          type: types.UPDATE_SENSORS_SUCCESS,
          data: json
        }
};

export function updateSensorError(json) {
    return {
          type: types.UPDATE_SENSORS_ERROR,
          data: json
        }
};

export function deleteSensor(sensor,servicePath) {
    return function(dispatch) {
          dispatch({type: types.DELETE_SENSORS_START});
          return axios.delete('http://orion.waziup.io/v1/data/entities/'+sensor.sensorId,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':servicePath,
                        'fiware-service':fiwareService,
                      },
                  })
            .then(function(response) {
                console.log(response);
              dispatch(deleteSensorSuccess(response.data));
            })
            .catch(function(response){
                console.log(response);
              dispatch(deleteSensorError(response.data));
            })
        }

};
export function deleteSensorSuccess(json) {
    return{
          type: types.DELETE_SENSORS_SUCCESS,
          data: json
        }
};

export function deleteSensorError(json) {
    return {
          type: types.DELETE_SENSORS_ERROR,
          data: json
        }
};
export function adminLogin(user) {
    return function(dispatch) {
        adminClient(settings)
          .then((client) => {
            client.users.find(user.aud,{email:user.email})
                .then((userK) => {
                    console.log(userK);
                    dispatch(updateUserSuccess(userK[0]));
              },(err)=>{
                dispatch(adminLoginError(err));
              });

          })
          .catch((err) => {
            dispatch(adminLoginError(err));
          });
    }
};
export function adminLoginSuccess(json) {
    return{
          type: types.ADMIN_LOGIN_SUCCESS,
          data: json
        }
};

export function adminLoginError(json) {
    return {
          type: types.ADMIN_LOGIN_ERROR,
          data: json
        }
};
export function getUsers() {
    return function(dispatch) {
        adminClient(settings)
          .then((client) => {
            client.users.find('waziup')
                .then((users) => {
                    dispatch(getUsersSuccess(users));
              },(err)=>{
                dispatch(getUsersError(err));
              });

          })
          .catch((err) => {
            dispatch(getUsersError(err));
          });
    }
};
export function getUsersSuccess(json) {
    return{
          type: types.GET_USERS_SUCCESS,
          data: json
        }
};

export function getUsersError(json) {
    return {
          type: types.GET_USERS_ERROR,
          data: json
        }
};

export function updateUser(user,attrs) {
    return function(dispatch) {
         dispatch({type: types.UPDATE_USER_START});
         adminClient(settings)
          .then((client) => {
            client.users.find(user.aud,{email:user.email})
                .then((userK) => {
                    console.log(userK);
                    if(typeof userK[0].attributes==='undefined'){
                        userK[0].attributes = {};
                    }
                    userK[0].attributes.ServicePath  = attrs.servicePath || "" ;
                    userK[0].attributes.Phone        = attrs.phone       || "" ;
                    userK[0].attributes.Facebook     = attrs.facebook    || "" ;
                    userK[0].attributes.Twitter      = attrs.twitter     || "" ;
                    client.users.update(user.aud, userK[0])
                    .then(() => {
                        updateUserSuccess(userK[0]);
                    });
                  });
          })
          .catch((err) => {
            updateUserError(err);
          });
    }
};
export function updateUserSuccess(json) {
    return{
          type: types.UPDATE_USER_SUCCESS,
          data: json
        }
};

export function updateUserError(json) {
    return {
          type: types.UPDATE_USER_ERROR,
          data: json
        }
};

