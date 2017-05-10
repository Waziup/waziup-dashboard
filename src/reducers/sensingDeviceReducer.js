import {
  DEVICES_LIST_REQUEST, DEVICES_LIST_REQUEST_ERROR, DEVICES_LIST_FETCHED
} from '../actions/sensingDeviceActions.js'

const sensingDeviceReducer = (state={ isFetching: false }, action) => {
  switch (action.type) {
    case DEVICES_LIST_REQUEST:
      return {
        ...state, 
        isFetching: true,
      }
    case DEVICES_LIST_FETCHED:
      return {
        ...state, 
        isFetching: false,
        listDevices: action.listDevices,
        lastUpdated: action.lastUpdated
       }
    case DEVICES_LIST_REQUEST_ERROR:
      return {
        ...state, 
        isFetching: false,
        errMsg: action.errMsg
      }
    default:
      return state
  }
}

export default sensingDeviceReducer