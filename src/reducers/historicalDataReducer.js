import {HISTORICAL_DATA_REQUEST,HISTORICAL_DATA_REQUEST_ERROR ,HISTORICAL_DATA_FETCHED } from '../actions/historicalDataActions.js'

const historicalDataReducer = (state ={}, action) => {
  //let a = (state[action.deviceId] === undefined ? ...state[action.deviceId] : )
  switch (action.type) {
    case HISTORICAL_DATA_REQUEST:
      return {
        ...state, 
        [action.deviceId]: {
          ...state[action.deviceId],
          [action.sensorId]: {
              ...(state[action.deviceId] ? state[action.deviceId][action.sensorId] : {}),
             isFetching: true, 
             fetched: false, 
             lastUpdated: action.lastUpdated
          }
        }
      }
    case HISTORICAL_DATA_FETCHED:
      return {
        ...state,
        [action.deviceId]: {
          ...state[action.deviceId],
          [action.sensorId]: {
            ...state[action.deviceId][action.sensorId],
             isFetching: false, 
             fetched: true, 
             lastUpdated: action.lastUpdated,
             data: action.data
          }
        }
      }
    case HISTORICAL_DATA_REQUEST_ERROR:
      return {
        ...state,
        [action.deviceId]: {
          ...state[action.deviceId],
          [action.sensorId]: {
            ...state[action.deviceId][action.sensorId],
             isFetching: false, 
             fetched: false, 
             errMsg: action.errMsg
          }
        }
      }
    default:
      return state
  }
}


export default historicalDataReducer