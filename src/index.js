import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store';
import Layout from './components/Layout';
import Home from './components/Home';
import Sensors from './components/sensors/Sensors';
import Sensor from './components/sensors/sensor/SensorDetail';
import Profile from './components/profile/ProfileContainer.js';
import Settings from './components/profile/SettingsContainer.js';
import UserList from './components/user/UserList/UserListContainer';
import User from './components/user/UserList/User';
import Notifications from './components/notification/Notifications.js';
import NotifDetail from './components/notification/notifDetail/NotifDetail.js';
import UserPermissions from './components/user/UserPermissions.js';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Keycloak from 'keycloak-js';
import config from './config';
import UTIL from './lib/utils.js';
import { getSensors, getUsers } from "./actions/actions.js"

injectTapEventPlugin();

export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

//Define app routes
const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'home', component: Home },
    { path: 'profile', component: Profile },
    { path: 'profile/settings', component: Settings },
    { path: 'notifications', component: Notifications },
    { path: 'notifications/:notifId', component: NotifDetail },
    { path: 'sensors', component: Sensors },
    { path: 'sensors/:sensorId', component: Sensor },
    { path: 'users', component: UserList },
    { path: 'users/:uid', component: User },
    { path: 'userpermissions', component: UserPermissions },
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

  keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success(authenticated => {
    if (authenticated) {
      store.getState().keycloak = keycloak;
      //setInterval(() => {keycloak.updateToken(10).error(() => keycloak.logout()); }, 10000);
      setInterval(() => {
        keycloak.updateToken(3600).
        success(function (refreshed) {
          getSensors();
          getUsers();
        }).
        error(function () {
          alert('Failed to refresh the token, or the session has expired');
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

