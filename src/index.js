import React from 'react';
import ReactDOM from 'react-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore} from 'react-router-redux'
import Keycloak from 'keycloak-js';
import configureStore from './store';
import Layout from './components/Layout';
import Home from './components/Home';
import MVPCattle from './components/Mvpcattle';
import MVPAgri from './components/Mvpagri';
import MVPUrbanWaste from './components/Mvpurbanwaste';
import MVPFishFarming from './components/Mvpfishfarming';
import Sensors from './components/Sensors';
import Sensor from './components/sensors/sensorDetail/sensorDetailContainer';
import Profile from './components/profile/ProfileContainer.js';
import Settings from './components/profile/SettingsContainer.js';
import UserList from './components/user/UserList/UserListContainer';
import Notification from './components/notification/NotificationForm.js';
import './index.css';
import {fetchSensors} from './actions/actions';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

function loadSensors() {
    store.dispatch(fetchSensors());
};

const MyApp = () =>{
  return (
    <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
      <Layout />
    </MuiThemeProvider>
  );
}

const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Home, onEnter:loadSensors },
  childRoutes: [
    { path: 'home', component:  Home, onEnter:loadSensors},
    { path: 'apps', component:  Home },
    { path: 'profile', component:  Profile },
    { path: 'profile/settings', component:  Settings },
    { path: 'apps/cattle', component:  MVPCattle },
    { path: 'apps/agri', component:  MVPAgri },
    { path: 'apps/urbanwaste', component:  MVPUrbanWaste },
    { path: 'apps/fishfarming', component:  MVPFishFarming },
    { path: 'notification', component: Notification},
    { path: 'sensors', component:  Sensors , onEnter:loadSensors},
    { path: 'sensors/:sensorId', component:Sensor , onEnter:loadSensors},
    { path: 'users', component:  UserList },
    { path: 'home', component:  Home },
  ]
}

function displayPage() {

  ReactDOM.render( 
     <Provider store={store}>
          <Router history={history} routes={routes} />
        </Provider>,
    document.getElementById('root')
    );

}

const kc = Keycloak('/keycloak.json');

const checkIdentity = process.env.REACT_APP_DASHBOARD_IDENTITY;

if (checkIdentity === 'false') {

  console.log("test" + checkIdentity)
  displayPage();

} else {
  
  kc.init({ onLoad: 'login-required'}).success(authenticated => {
  
    if (!authenticated) {

      kc.login();
    
    } else {
    
      console.log(authenticated);
      store.getState().keycloak = kc;
      setInterval(() => {
        kc.updateToken(10).error(() => kc.logout());
      }, 10000);
    
      displayPage();
    }
  }).error(function (error) {

    console(error);
  });
}
