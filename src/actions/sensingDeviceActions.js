import axios from 'axios'

export const DEVICES_LIST_REQUEST = 'DEVICES_LIST_REQUEST'
export const DEVICES_LIST_REQUEST_ERROR = 'DEVICES_LIST_REQUEST_ERROR'
export const DEVICES_LIST_FETCHED = 'DEVICES_LIST_FETCHED'

export const devicesListRequest = (orionService, orionServicePath) => ({
  type: DEVICES_LIST_REQUEST,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  lastUpdated: Date.now()
})

export const devicesListRequestError = (orionService, orionServicePath, errMsg) => ({
  type: DEVICES_LIST_REQUEST_ERROR,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  errMsg: errMsg
})

export const devicesListFetched = (orionService, orionServicePath, listDevices) => ({
  type: DEVICES_LIST_FETCHED,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  listDevices: listDevices,
  lastUpdated: Date.now()
})

export const fetchDevicesList = (orionService, orionServicePath) => (dispatch, getState) => {
  dispatch(devicesListRequest(orionService, orionServicePath))
  //const servicePath = getState().security.userInfo.idTokenParsed.ServicePath
  //const service = getState().security.userInfo.idTokenParsed.Service
  return axios.get('http://orion.waziup.io/v1/data/entities',
    {
      params: { 'limit': '100', 'attrs': 'dateModified,dateCreated,servicePath,*' },
      headers: {
        'Fiware-ServicePath': orionServicePath,
        'Fiware-Service': orionService,
      }
    })
    .then((response) => {
      dispatch(devicesListFetched(orionService, orionServicePath, response.data));
    })
    .catch((response) => {
      dispatch(devicesListRequestError(orionService, orionServicePath, response.data));
    })
}