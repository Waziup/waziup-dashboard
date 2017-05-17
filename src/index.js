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
import Sensors from './components/SensorsContainer';
import Sensor from './components/sensors/sensorDetail/sensorDetailContainer';
import Profile from './components/profile/ProfileContainer.js';
import Settings from './components/profile/SettingsContainer.js';
import UserList from './components/user/UserList/UserListContainer';
import Notification from './components/notification/NotificationForm.js';
import './index.css';
import * as actions from './actions/actions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import UTIL from './utils'

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

export function loadSensors(isAllSensors) {
    //console.log("loadSensors" + JSON.stringify(store.getState()));

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
       var service     = userDetails.Service;
       var servicePath = userDetails.ServicePath + (isAllSensors?"#":"");
       store.dispatch( actions.fetchSensors(service, servicePath));
    }
};

export function createSensor(sensorId, sensorType, sensorLon, sensorLat) {

    var userDetails = store.getState().keycloak.idTokenParsed;
    
    if(userDetails) {
      var sensor  = {
        id: sensorId,
        type: sensorType,
        location: {
            value: {
              type: "Point",
              coordinates: [sensorLon, sensorLat]
            },
            type: "geo:json"
          },
          owner: {
           type: "string",
           value: userDetails.preferred_username
          },
      }
      store.dispatch(actions.createSensor(sensor, userDetails.Service, userDetails.ServicePath));
    }
}

export function deleteSensor(sensor) {
    console.log("deleteSensors" + JSON.stringify(sensor));

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
       store.dispatch( actions.deleteSensor(sensor.id, userDetails.Service, sensor.servicePath.value));
    }
};
  
export function getHisto(sensor) {
    console.log("getHisto" + JSON.stringify(sensor));

    var userDetails = store.getState().keycloak.idTokenParsed;

    if(userDetails) {
        var meas =  UTIL.getMeasurements(sensor);
        meas.map((item) => {
           store.dispatch( actions.getHistoData(sensor.id, item.key, userDetails.Service, sensor.servicePath.value));
        });
    }
};

export function updateSensorLocation(sensorId, sensorLon, sensorLat) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if(userDetails) {
    let attribute  = {
      location: {
        value: {
          type: "Point",
          coordinates: [sensorLon, sensorLat]
        },
        type: "geo:json"
      }
    }

    console.log("update" + JSON.stringify(store.getState().sensors));
    var mySensor = store.getState().sensors.sensors.find((s) => {
        return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, mySensor.servicePath.value));
  }
}

export function updateSensorOwner(sensorId) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if(userDetails) {
    let attribute  = {
      owner: {
        type: "string",
        value: userDetails.preferred_username,
      }
    }

    var mySensor = store.getState().sensors.sensors.find((s) => {
        return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, mySensor.servicePath.value));
  }
}


function loadUsers(){
  store.dispatch(actions.getUsers());
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
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'home', component:  Home },
    { path: 'apps', component:  Home },
    { path: 'profile', component:  Profile },
    { path: 'profile/settings', component:  Settings },
    { path: 'apps/cattle', component:  MVPCattle },
    { path: 'apps/agri', component:  MVPAgri },
    { path: 'apps/urbanwaste', component:  MVPUrbanWaste },
    { path: 'apps/fishfarming', component:  MVPFishFarming },
    { path: 'notification', component: Notification},
    { path: 'sensors', component:  Sensors},
    { path: 'sensors/:sensorId', component:Sensor},
    { path: 'users', component:  UserList, onEnter: loadUsers},
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

  kc.init({ onLoad: 'login-required'}).
    success(authenticated => {
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
