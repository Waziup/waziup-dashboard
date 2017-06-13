import axios from 'axios'

export const SUBSCRIPTIONS_LIST_REQUEST = 'SUBSCRIPTIONS_LIST_REQUEST'
export const SUBSCRIPTIONS_LIST_REQUEST_ERROR = 'SUBSCRIPTIONS_LIST_REQUEST_ERROR'
export const SUBSCRIPTIONS_LIST_FETCHED = 'SUBSCRIPTIONS_LIST_FETCHED'
export const SUBSCRIPTION_ADD_REQUEST = 'SUBSCRIPTION_ADD_REQUEST'
export const SUBSCRIPTION_ADD_SUCCESS = 'SUBSCRIPTION_ADD_SUCCESS'
export const SUBSCRIPTION_ADD_ERROR = 'SUBSCRIPTION_ADD_ERROR'

export const subscriptionsListRequest = (orionService, orionServicePath) => ({
  type: SUBSCRIPTIONS_LIST_REQUEST,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  lastUpdated: Date.now()
})

export const subscriptionsListRequestError = (orionService, orionServicePath, errMsg) => ({
  type: SUBSCRIPTIONS_LIST_REQUEST_ERROR,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  errMsg: errMsg
})

export const subscriptionsListFetched = (orionService, orionServicePath, subscriptionsList) => ({
  type: SUBSCRIPTIONS_LIST_FETCHED,
  orionService: orionService, 
  orionServicePath: orionServicePath,
  subscriptionsList: subscriptionsList,
  lastUpdated: Date.now()
})


export const fetchSubscriptionsList = (orionService, orionServicePath) => (dispatch, getState) => {
  //console.log(orionService, orionServicePath)
  dispatch(subscriptionsListRequest(orionService, orionServicePath))
  //const servicePath = getState().security.userInfo.idTokenParsed.ServicePath + '#'
  //const service = getState().security.userInfo.idTokenParsed.Service
  //curl broker.waziup.io/v2/subscriptions -s -S --header "${service}" --header "${servicePath}" | jq "."
  return axios.get('http://orion.waziup.io/v1/data/subscriptions',
    {
      headers: {
        'Fiware-ServicePath': orionServicePath,
        'Fiware-Service': orionService 
      }
    })
    .then((response) => {
      dispatch(subscriptionsListFetched(orionService, orionServicePath, response.data));
    })
    .catch((response) => {
      //console.log(JSON.stringify(response))
      dispatch(subscriptionsListRequestError(orionService, orionServicePath, JSON.stringify(response)));
    })
}