import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist'
import {rootReducer, routerReducer} from '../reducers/reducers.js';
import thunkMiddleware from 'redux-thunk';

//import createHistory from 'history/lib/createBrowserHistory';
const composeEnhancers = global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createAppStore = composeEnhancers(
      applyMiddleware(thunkMiddleware),
      autoRehydrate()
)(createStore);

export default function configureStore(initialState) {
      const store = createAppStore(rootReducer,
            initialState);
      // begin periodically persisting the store
      /*config object
      blacklist array keys (read: reducers) to ignore rootReducer.routing
      whitelist array keys (read: reducers) to persist, if set all other keys will be ignored.*/
      const configPersist = { blacklist: [routerReducer, 'routing', 'form'] }; 
      persistStore(store, configPersist);
      return store;
};
