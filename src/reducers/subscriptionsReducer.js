import {SUBSCRIPTIONS_LIST_REQUEST,
SUBSCRIPTIONS_LIST_REQUEST_ERROR,
SUBSCRIPTIONS_LIST_FETCHED} from '../actions/subscriptionActions.js'

const subscriptionsReducer = (state={ isFetching: false, fetched: false }, action) => {
  switch (action.type) {
    case SUBSCRIPTION_ADD_REQUEST:
      return {
        ...state, 
        isFetching: false,
        fetched: true,
        sensingDevice: action.sensingDevice,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
        lastUpdated: action.lastUpdated
      }
    case SUBSCRIPTION_ADD_ERROR:
    case SUBSCRIPTION_ADD_SUCCESS:

    case SUBSCRIPTIONS_LIST_REQUEST:
      return {
        ...state, 
        isFetching: true,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
      }
    case SUBSCRIPTIONS_LIST_FETCHED:
      return {
        ...state, 
        isFetching: false,
        fetched: true,
        subscriptionsList: action.subscriptionsList,
        orionService: action.orionService, 
        orionServicePath: action.orionServicePath,
        lastUpdated: action.lastUpdated
      }
    case SUBSCRIPTIONS_LIST_REQUEST_ERROR:
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

export default subscriptionsReducer