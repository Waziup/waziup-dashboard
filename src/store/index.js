import { applyMiddleware, compose, createStore } from 'redux';
import { autoRehydrate, persistStore } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/reducers.js';

const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createAppStore = composeEnhancers(
  applyMiddleware(thunkMiddleware),
  autoRehydrate(),
)(createStore);

export default function configureStore(initialState) {
  const store = createAppStore(rootReducer, initialState);
  const configPersist = { blacklist: ['routing', 'keycloak', 'messages'] };
  persistStore(store, configPersist);
  return store;
}
