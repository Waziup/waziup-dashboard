import * as types from './actionTypes';
import axios from 'axios'

const fiwareService = 'waziup'
const fiwareServicePath = '/'
const fiwareServicePathQuery = '/#'

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
          const querystring = require('query-string');
          return axios.get('http://orion.waziup.io/v1/data/entities',
                           {
                             params: {'limit': '100'},
                             headers: {
                               'Fiware-ServicePath':fiwareServicePathQuery,
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
export function createSensor(sensor) {
    return function(dispatch) {
          dispatch({type: types.CREATE_SENSOR_START});
          return axios.post('http://orion.waziup.io/v1/data/entities',sensor,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':fiwareServicePath,
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
          type: types.CREATE_SENSOR_SUCCESS,
          data: json
        }
};

export function createSensorError(json) {
    return {
          type: types.CREATE_SENSOR_ERROR,
          data: json
        }
};
export function deleteSensor(sensor) {
    return function(dispatch) {
          dispatch({type: types.DELETE_SENSOR_START});
          return axios.delete('http://orion.waziup.io/v1/data/entities'+sensor.sensorId,{
                      headers: {
                        'content-type':'application/json',
                        'fiware-servicepath':fiwareServicePath,
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
          type: types.DELETE_SENSOR_SUCCESS,
          data: json
        }
};

export function deleteSensorError(json) {
    return {
          type: types.DELETE_SENSOR_ERROR,
          data: json
        }
};

