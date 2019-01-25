import { applyMiddleware, compose, createStore } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/reducers.js';

// import createHistory from 'history/lib/createBrowserHistory';
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createAppStore = composeEnhancers(
  applyMiddleware(thunkMiddleware),
  autoRehydrate(),
)(createStore);

export default function configureStore(initialState) {
  const store = createAppStore(rootReducer, initialState);
  const configPersist = { blacklist: ['routing', 'form'] };
  persistStore(store, configPersist);
  return store;
}
