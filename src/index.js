import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Keycloak from 'keycloak-js';
import configureStore from './store';
import Layout from './components/Layout';
import Devices from './components/devices/Devices';
import Users from './components/users/Users';
import UserDetail from './components/users/UserDetail';
import UserPermissions from './components/users/Perms';
import Gateways from './components/gateways/Gateways';
import GatewayDetail from './components/gateways/GatewayDetail';
import DeviceDetail from './components/devices/device/DeviceDetail';
import SensorDetail from './components/devices/device/sensor/SensorDetail';
import ActuatorDetail from './components/devices/device/actuator/ActuatorDetail';
import Notifs from './components/notifs/Notifs.js';
import NotifDetail from './components/notifs/NotifDetail.js';
import Projects from './components/projects/Projects';
import ProjectDetail from './components/projects/ProjectDetail';
import Settings from './components/settings/Settings';
import config from './config';

injectTapEventPlugin();

export const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

// Define app routes
const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Devices },
  childRoutes: [
    { path: 'notifications', component: Notifs },
    { path: 'notifications/:notifId', component: NotifDetail },
    { path: 'projects', component: Projects },
    { path: 'projects/:projectId', component: ProjectDetail },
    { path: 'devices', component: Devices },
    { path: 'devices/:deviceId', component: DeviceDetail },
    { path: 'devices/:deviceId/sensors/:sensId', component: SensorDetail },
    { path: 'devices/:deviceId/actuators/:actuId', component: ActuatorDetail },
    { path: 'gateways', component: Gateways },
    { path: 'gateways/:gatewayId', component: GatewayDetail },
    { path: 'users', component: Users },
    { path: 'users/:userId', component: UserDetail },
    { path: 'users/:userId/perms', component: UserPermissions },
    { path: 'settings', component: Settings },
    { path: '*', component: () => <h2> Page not found!</h2> }
  ],
  onChange: (prevState, nextState) => {
      if (nextState.location.action !== "POP") {
        window.scrollTo(0, 0);
      }
  }
}


/*
 * Perform the keycloak authentication
 * to get user infos on client side
 */
export function keycloakLogin() {
  const keycloak = Keycloak({
    url: config.keycloakUrl,
    realm: config.realm,
    clientId: config.clientId,
    credentials: {
      secret: config.clientSecret 
    },
  });

  keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success((authenticated) => {
    if (authenticated) {
      store.getState().keycloak = { token: keycloak.token, logout: keycloak.logout };
      store.getState().current_user = getUser(keycloak.idTokenParsed);
      setInterval(() => {
        keycloak.updateToken(30).success((refreshed) => {
          if (refreshed) {
            store.getState().keycloak = { token: keycloak.token, logout: keycloak.logout };
            store.getState().current_user = getUser(keycloak.idTokenParsed);
          }
        }).error(() => {
          alert('Your session has expired, please log in again');
          keycloak.logout();
        });
      }, 10000);

      displayPage();
    }
  }).error((error) => {
    console.error(error);
    console.error('Authentication error. Check Keycloak params and cors issues.');
  });
}

// Render the page with the layout and routes
function displayPage() {
  console.info(`SERVER_URL: ${process.env.SERVER_URL}`);
  console.info(`API_SERVER_URL: ${process.env.API_SERVER_URL}`);
  console.info(`DOC_SERVER_URL: ${process.env.DOC_SERVER_URL}`);
  console.info(`KEYCLOAK_URL: ${process.env.KEYCLOAK_URL}`);
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    document.getElementById('app'),
  );
}

function getUser(keycloakId) {
  return {
    username: keycloakId.preferred_username,
    lastName: keycloakId.family_name,
    firstName: keycloakId.given_name,
  };
}
