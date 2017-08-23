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

const orionApi = process.env.REACT_APP_ORION_API
const cometApi = process.env.REACT_APP_COMET_API


function requestSensors() {
    return {type: types.REQ_SENSORS}
};

function receiveSensors(json) {
    return{
          type: types.RECV_SENSORS,
          data: json
        }
};

function receiveError(json) {
    return {
          type: types.RECV_ERROR,
          data: json
        }
};

export function fetchSensors(service, servicePath) {

    return function(dispatch) {
          dispatch(requestSensors());
          return axios.get(orionApi + '/entities',
                           {
                             params: {'limit': '100', 'attrs': 'dateModified,dateCreated,servicePath,*'},
                             headers: {
                               'Fiware-ServicePath':servicePath,
                               'Fiware-Service':service,
                             }
                           })
            .then(function(response) {
              dispatch(receiveSensors(response.data));
            })
            .catch(function(response){
              //dispatch(receiveError(response.data));
            })
        }
};

export function createSensor(sensor, service, servicePath) {
    return function(dispatch) {
          dispatch({type: types.CREATE_SENSORS_START});
          return axios.post(orionApi + '/entities', sensor,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':servicePath,
                        'fiware-service':service,
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

export function updateSensorAttributes(sensorId, update, service, servicePath) {
    return function(dispatch) {
          return axios.post(orionApi + '/entities/'+sensorId+'/attrs', update, {
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':servicePath,
                        'fiware-service':service,
                      }
                  })
            .then(function(response) {
                console.log(response);
              dispatch(updateSensorSuccess(response.data));
            })
            .catch(function(response){
                console.log(response);
              dispatch(updateSensorError(response.data));
            })
        }

};
export function updateSensorStart(json) {
    return{
          type: types.UPDATE_SENSORS_START,
          data: json
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

export function deleteSensor(sensorId, service, servicePath) {
    return function(dispatch) {
          dispatch({type: types.DELETE_SENSORS_START});
          return axios.delete(orionApi + '/entities/' + sensorId,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath': servicePath,
                        'fiware-service': service,
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
            client.users.find(user.aud,{id:user.id})
                .then((userK) => {
                    //console.log(userK);
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
            client.users.find(user.aud,{id:user.id})
                .then((userK) => {
                    //console.log(userK);
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

export function getHistoData(sensorId, measurement, service, servicePath) {
    console.log("getHistoData" + sensorId);
    return function(dispatch) {
          var url= cometApi + '/STH/v1/contextEntities/type/SensingDevice/id/' + sensorId + '/attributes/' + measurement;
          return axios.get(url,{
              params: {'lastN': '24'},
              headers: {
                'content-type': 'application/json',
                'fiware-servicepath': servicePath,
                'fiware-service': service,
              },
            })
            .then(function(response) {
                console.log(response);
                const contextResponse0 = response.data.contextResponses[0];
                  const { contextElement: contextElement } = contextResponse0;
                  const attribute0 = contextElement.attributes[0];
                  const values = attribute0.values;
                  const data = [];
                  for (var i in values) {
                    const value = values[i];
                    //console.log(value.attrValue + "  ,  " + value.recvTime);
                    data.push({ time: value.recvTime, value: parseFloat(value.attrValue) });
                  }
                  if (data.length > 0) {
                      dispatch(getHistoDataSuccess(measurement,data));
                  }

            })
            .catch(function(response){
              dispatch(getHistoDataError(response.data));
            })
        }
};

export function getHistoDataSuccess(measurementId,data) {
    return{
          type: types.GET_HISTORICAL_SUCCESS,
          data: {measurementId:measurementId,json:data}
    }
};

export function getHistoDataError(json) {
    return {
          type: types.GET_HISTORICAL_ERROR,
          data: json
        }
};

export function createSubscription(sub, service, servicePath) {
    return function(dispatch) {
          var url= orionApi + '/subscriptions'
          return axios.post(url, sub, {
              headers: {
                'content-type': 'application/json',
                'fiware-servicepath': servicePath,
                'fiware-service': service,
              },
            })
            .then(function(response) {
              dispatch(createSubscriptionSuccess(response.data));
            })
            .catch(function(response){
              dispatch(createSubscriptionError(response.data));
            })
        }
};

export function createSubscriptionSuccess(data) {
    return{
          type: types.CREATE_SUBSCRIPTION_SUCCESS,
          data: {json:data}
    }
};

export function createSubscriptionError(json) {
    return {
          type: types.CREATE_SUBCRIPTION_ERROR,
          data: json
        }
};

export function getNotifications(service, servicePath) {
    return function(dispatch) {
          var url= orionApi + '/subscriptions'
          return axios.get(url, {
              headers: {
                'fiware-servicepath': servicePath,
                'fiware-service': service,
              },
            })
            .then(function(response) {
              console.log("notif succ")
              dispatch(getNotificationsSuccess(response.data));
            })
           // .catch(function(response){
           //   console.log("notif error")
           //   dispatch(getNotificationsError(response.data));
           // })
        }
};

export function getNotificationsSuccess(data) {
    return{
          type: types.GET_NOTIFICATIONS_SUCCESS,
          data: data
    }
};

export function getNotificationsError(json) {
    return {
          type: types.GET_NOTIFICATIONS_ERROR,
          data: json
        }
};
export function deleteNotif(notifId, service, servicePath) {
    return function(dispatch) {
          dispatch({type: types.DELETE_NOTIF_START});
          return axios.delete(orionApi + '/subscriptions/' + notifId,{
                      headers: {
                        'fiware-servicepath': servicePath,
                        'fiware-service': service,
                      },
                  })
            .then(function(response) {
                console.log(response);
              dispatch(deleteNotifSuccess(response.data));
            })
            .catch(function(response){
                console.log(response);
              dispatch(deleteNotifError(response.data));
            })
        }

};

export function deleteNotifSuccess(json) {
    return{
          type: types.DELETE_NOTIF_SUCCESS,
          data: json
        }
};

export function deleteNotifError(json) {
    return {
          type: types.DELETE_NOTIF_ERROR,
          data: json
        }
};2
