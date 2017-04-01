import * as types from './actionTypes';
import axios from 'axios'
import adminClient from 'keycloak-admin-client'
const settings = {
  baseUrl: 'http://localhost:8180/auth',
  username: process.env.REACT_APP_ADMIN_USER,
  password: process.env.REACT_APP_ADMIN_PASS,
  grant_type: 'password',
  client_id: 'admin-cli'
};

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

export function fetchSensors() {
// curl http://broker.waziup.io/v2/entities --header 'Fiware-ServicePath:/#' --header 'Fiware-Service:waziup' -X GET
    return function(dispatch) {
          dispatch(requestSensors());
          return axios.get('http://orion.waziup.io/v1/data/entities',{
                  headers: {
                    'Fiware-ServicePath':'/C4A',
                    'Fiware-Service':'waziup',
                  },
                })
            .then(function(response) {
              dispatch(receiveSensors(response.data));
            })
            .catch(function(response){
              dispatch(receiveError(response.data));
            })
        }
};
export function createSensor(sensor) {
    return function(dispatch) {
          dispatch({type: types.CREATE_SENSORS_START});
          return axios.post('http://orion.waziup.io/v1/data/entities',sensor,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':'/C4A',
                        'fiware-service':'waziup',
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
export function deleteSensor(sensor) {
    return function(dispatch) {
          dispatch({type: types.DELETE_SENSORS_START});
          return axios.delete('http://orion.waziup.io/v1/data/entities'+sensor.sensorId,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':'/c4a',
                        'fiware-service':'waziup',
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
        console.log(settings);
        adminClient(settings)
          .then((client) => {
            client.users.find(user.aud,{email:user.email})
                .then((userK) => {
                    console.log(userK);
                    dispatch(updateUserSuccess(userK[0]));
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
export function updateUser(user,attrs) {

    return function(dispatch) {
         dispatch({type: types.UPDATE_USER_START});
         adminClient(settings)
          .then((client) => {
            client.users.find(user.aud,{email:user.email})
                .then((userK) => {
                    console.log(userK);
                    userK[0].attributes.ServicePath  = attrs.servicePath || "" ;
                    userK[0].attributes.Phone  = attrs.phone || "" ;
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

