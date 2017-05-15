import axios from 'axios'

export const DEVICES_LIST_REQUEST = 'DEVICES_LIST_REQUEST'
export const DEVICES_LIST_REQUEST_ERROR = 'DEVICES_LIST_REQUEST_ERROR'
export const DEVICES_LIST_FETCHED = 'DEVICES_LIST_FETCHED'

export const devicesListRequest = () => ({
  type: DEVICES_LIST_REQUEST,
  lastUpdated: Date.now()
})

export const devicesListRequestError = (errMsg) => ({
  type: DEVICES_LIST_REQUEST_ERROR,
  errMsg: errMsg
})

export const devicesListFetched = (listDevices) => ({
  type: DEVICES_LIST_FETCHED,
  listDevices: listDevices,
  lastUpdated: Date.now()
})

export const fetchDevicesList = () => (dispatch, getState) => {
  dispatch(devicesListRequest())
//  return (dispatch) => {
    //const querystring = require('query-string');
    const servicePath = getState().security.userInfo.idTokenParsed.ServicePath
    const service = getState().security.userInfo.idTokenParsed.Service
    return axios.get('http://orion.waziup.io/v1/data/entities',
      {
        params: { 'limit': '100', 'attrs': 'dateModified,dateCreated,servicePath,*' },
        headers: {
          'Fiware-ServicePath': servicePath,
          'Fiware-Service': service,
        }
      })
      .then((response) => {
        dispatch(devicesListFetched(response.data));
      })
      .catch((response) => {
        dispatch(devicesListRequestError(response.data));
      })
  //}
}