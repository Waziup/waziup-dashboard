import {
  DEVICES_LIST_REQUEST, DEVICES_LIST_REQUEST_ERROR, DEVICES_LIST_FETCHED
} from '../actions/sensingDeviceActions.js'

const sensingDeviceReducer = (state={ isFetching: false, fetched: false }, action) => {
  switch (action.type) {
    case DEVICES_LIST_REQUEST:
      return {
        ...state, 
        isFetching: true,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
      }
    case DEVICES_LIST_FETCHED:
      return {
        ...state, 
        isFetching: false,
        fetched: true,
        listDevices: action.listDevices,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
        lastUpdated: action.lastUpdated
      }
    case DEVICES_LIST_REQUEST_ERROR:
      return {
        ...state, 
        isFetching: false,
        fetched: false,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
        errMsg: action.errMsg
      }
    default:
      return state
  }
}

export default sensingDeviceReducer