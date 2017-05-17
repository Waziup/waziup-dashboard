import {SUBSCRIPTIONS_LIST_REQUEST,
SUBSCRIPTIONS_LIST_REQUEST_ERROR,
SUBSCRIPTIONS_LIST_FETCHED} from '../actions/sensingDeviceActions.js'

const subscriptionsReducer = (state={ isFetching: false, fetched: false }, action) => {
  switch (action.type) {
    case SUBSCRIPTIONS_LIST_REQUEST:
      return {
        ...state, 
        isFetching: true,
      }
    case SUBSCRIPTIONS_LIST_FETCHED:
      return {
        ...state, 
        isFetching: false,
        fetched: true,
        subscriptionsList: action.subscriptionsList,
        lastUpdated: action.lastUpdated
      }
    case SUBSCRIPTIONS_LIST_REQUEST_ERROR:
      return {
        ...state, 
        isFetching: false,
        fetched: false,
        errMsg: action.errMsg
      }
    default:
      return state
  }
}

export default subscriptionsReducer