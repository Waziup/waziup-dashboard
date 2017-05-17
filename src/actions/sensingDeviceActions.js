import axios from 'axios'

export const DEVICES_LIST_REQUEST = 'DEVICES_LIST_REQUEST'
export const DEVICES_LIST_REQUEST_ERROR = 'DEVICES_LIST_REQUEST_ERROR'
export const DEVICES_LIST_FETCHED = 'DEVICES_LIST_FETCHED'
export const SUBSCRIPTIONS_LIST_REQUEST = 'SUBSCRIPTIONS_LIST_REQUEST'
export const SUBSCRIPTIONS_LIST_REQUEST_ERROR = 'SUBSCRIPTIONS_LIST_REQUEST_ERROR'
export const SUBSCRIPTIONS_LIST_FETCHED = 'SUBSCRIPTIONS_LIST_FETCHED'

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

export const subscriptionsListRequest = () => ({
  type: SUBSCRIPTIONS_LIST_REQUEST,
  lastUpdated: Date.now()
})

export const subscriptionsListRequestError = (errMsg) => ({
  type: SUBSCRIPTIONS_LIST_REQUEST_ERROR,
  errMsg: errMsg
})

export const subscriptionsListFetched = (subscriptionsList) => ({
  type: SUBSCRIPTIONS_LIST_FETCHED,
  subscriptionsList: subscriptionsList,
  lastUpdated: Date.now()
})

export const fetchDevicesList = () => (dispatch, getState) => {
  dispatch(devicesListRequest())
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
}

export const fetchSubscriptionsList = () => (dispatch, getState) => {
  dispatch(subscriptionsListRequest())
  const servicePath = getState().security.userInfo.idTokenParsed.ServicePath
  const service = getState().security.userInfo.idTokenParsed.Service
  //curl broker.waziup.io/v2/subscriptions -s -S --header "${service}" --header "${servicePath}" | jq "."
  return axios.get('http://broker.waziup.io/v2/subscriptions',
    {
      headers: {
        'Fiware-ServicePath': servicePath,
        'Fiware-Service': service
      }
    })
    .then((response) => {
      dispatch(subscriptionsListFetched(response.data));
    })
    .catch((response) => {
      console.log(JSON.stringify(response))
      dispatch(subscriptionsListRequestError(JSON.stringify(response)));
    })
}