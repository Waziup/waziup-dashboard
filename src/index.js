import React from 'react'
import { render } from 'react-dom'
import { createStore, combineReducers, applyMiddleware} from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import securityReducer from './reducers/securityReducer'
import sensingDeviceReducer from './reducers/sensingDeviceReducer'
import SecurityContainer from './containers/SecurityContainer'
import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
//font-family: 'Roboto', sans-serif;

const rootReducer = combineReducers({
  security: securityReducer,
  sensingDevice: sensingDeviceReducer
})

const middleware = [thunk]
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}

let store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
)


console.log("Initial STORE: " + JSON.stringify(store.getState()));
render(
  <Provider store={store}>
    <SecurityContainer />
  </Provider>,
  document.getElementById('root')
)