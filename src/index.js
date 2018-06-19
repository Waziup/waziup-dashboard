import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';
import Layout from './components/Layout';
import Map from './components/Map';
import Sensors from './components/sensors/Sensors';
import Users from './components/users/Users';
import UserDetail from './components/users/UserDetail';
import UserPermissions from './components/users/Perms';
import Gateways from './components/gateways/Gateways';
import SensorDetail from './components/sensors/sensor/SensorDetail';
import MeasurementDetail from './components/sensors/sensor/MeasurementDetail';
import Settings from './components/profile/Settings.js';
import Notifications from './components/notifs/Notifications.js';
import NotifDetail from './components/notifs/NotifDetail.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Keycloak from 'keycloak-js';
import config from './config';
import UTIL from './lib/utils.js';
import { getUser, getSensors, getUsers } from "./actions/actions.js"

injectTapEventPlugin();

export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

//Define app routes
const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Sensors },
  childRoutes: [
    { path: 'map', component: Map },
    { path: 'notifications', component: Notifications },
    { path: 'notifications/:notifId', component: NotifDetail },
    { path: 'sensors', component: Sensors },
    { path: 'sensors/:sensorId', component: SensorDetail },
    { path: 'sensors/:sensorId/:measId', component: MeasurementDetail },
    { path: 'gateways', component: Gateways },
    { path: 'users', component: Users },
    { path: 'users/:userId', component: UserDetail },
    { path: 'users/:userId/perms', component: UserPermissions }
  ]
}

//Render the page with the layout and routes
function displayPage() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('app'));
}

//Perform the keycloak authentication 
//to get user infos on client side
export function keycloakLogin() {

  var keycloak = Keycloak({
    url: config.keycloakUrl,
    realm: config.realm,
    clientId: config.clientId
  });

  keycloak.init({ onLoad: 'login-required', checkLoginIframe: false, flow: 'hybrid' }).success(authenticated => {
    if (authenticated) {
      store.getState().keycloak = {token: keycloak.token, logout: keycloak.logout}
      console.log("kc " + JSON.stringify(keycloak.idTokenParsed))
      getUser(keycloak.idTokenParsed.sub)(store.dispatch)
      setInterval(() => {
        keycloak.updateToken(30).success(function (refreshed) {
            if(refreshed) {
              store.getState().keycloak = {token: keycloak.token, logout: keycloak.logout}
              getUser(keycloak.idTokenParsed.sub)(store.dispatch)
            }
          }).error(function () {
            alert('Your session has expired, please log in again');
            keycloak.logout();
          })
        }, 10000);

      displayPage();
    }
  }).error(function (error) {
    console.log(error);
    console.log("Authentication error. Check Keycloak params and cors issues.");
  });
}

