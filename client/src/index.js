import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from './store';
import Layout from './components/Layout';
import Home from './components/Home';
import SMComparisonChart from './components/SMComparisonChart';
import Sensors from './components/SensorsContainer';
import Sensor from './components/sensors/sensorDetail/sensorDetailContainer';
import Profile from './components/profile/ProfileContainer.js';
import Settings from './components/profile/SettingsContainer.js';
import UserList from './components/user/UserList/UserListContainer';
import Notifications from './components/notification/NotificationsContainer.js';
import NotifDetail from './components/notification/notifDetail/NotifDetailContainer.js';
import UserPermissions from './components/UserPermissions.js'
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as actions from './actions/actions';
import UTIL from './lib/utils.js';
import Keycloak from 'keycloak-js';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store)

// load all sensors in the store, using service and servicePath from the user attributes.
// if isAllSensors == true, the sensors with the same servicePath as the user or un sub-paths are loaded.
// if isAllSensors == false, the sensors with the strictly same servicePath as the user are loaded.
export function loadSensors(isAllSensors) {
  var userDetails = store.getState().keycloak.idTokenParsed;
  const perms = store.getState().keycloak.idTokenParsed.permissions;
  if (userDetails) {
    var service = userDetails.Service;
    //var servicePath = userDetails.ServicePath + (isAllSensors?"#":"");
    store.dispatch(actions.fetchSensors(perms, service, isAllSensors, store.getState().keycloak.token));
  }
};

// Create a sensor with the given parameters.
// the user's service and servicePath will be used.
export function createSensor(sensorId, sensorType, sensorLon, sensorLat) {
  var userDetails = store.getState().keycloak.idTokenParsed;
  if (userDetails) {
    var sensor = {
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
    store.dispatch(actions.createSensor(sensor, userDetails.Service, userDetails.ServicePath, store.getState().keycloak.token));
  }
}
// Create fields 
export function createVector(fieldId, bounds) {
  var userDetails = store.getState().keycloak.idTokenParsed;
  if (userDetails) {
    var field = {
      id: fieldId,
      type: 'Field',
      location: {
        value: {
          type: "Polygon",
          coordinates: bounds
        },
        type: "geo:json"
      },
      owner: {
        type: "string",
        value: userDetails.preferred_username
      },
    }
    console.log(field);
    store.dispatch(actions.createSensor(field, userDetails.Service, userDetails.ServicePath, store.getState().keycloak.token));
  }

}
//delete a sensor.
export function deleteSensor(sensorId) {
  console.log("deleteSensors" + JSON.stringify(sensorId));

  var userDetails = store.getState().keycloak.idTokenParsed;
  var mySensor = store.getState().sensors.sensors.find((s) => { return s.id === sensorId; });

  if (userDetails) {
    store.dispatch(actions.deleteSensor(sensorId, userDetails.Service, mySensor.servicePath.value, store.getState().keycloak.token));
  }
};

//get the history of values for each attributes of the sensor.
export function getHisto(sensor) {
  console.log("getHisto" + JSON.stringify(sensor));

  var userDetails = store.getState().keycloak.idTokenParsed;

  if (userDetails) {
    var meas = UTIL.getMeasurements(sensor);
    meas.foreach((item) => {
      store.dispatch(actions.getHistoData(sensor.id, item.key, userDetails.Service, sensor.servicePath.value));
    });
  }
};

//update the sensor location
export function updateSensorLocation(sensorId, sensorLon, sensorLat) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if (userDetails) {
    let attribute = {
      location: {
        value: {
          type: "Point",
          coordinates: [sensorLon, sensorLat]
        },
        type: "geo:json"
      }
    }

    console.log("update" + JSON.stringify(store.getState().sensors));
    var sensor = store.getState().sensors.sensors.find((s) => {
      return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, sensor.servicePath.value, store.getState().keycloak.token));
  }
}

//update the sensor owner
export function updateSensorOwner(sensorId) {

  var userDetails = store.getState().keycloak.idTokenParsed;

  if (userDetails) {
    let attribute = {
      owner: {
        type: "string",
        value: userDetails.preferred_username,
      }
    }

    var mySensor = store.getState().sensors.sensors.find((s) => {
      return s.id === sensorId;
    });
    store.dispatch(actions.updateSensorAttributes(sensorId, attribute, userDetails.Service, mySensor.servicePath.value, store.getState().keycloak.token));
  }
}

export function createSubscription(desc, sensorIds, attrs, qExpr, url, headers, payload, expires, throttling) {
  let userDetails = store.getState().keycloak.idTokenParsed;
  const accessToken = store.getState().keycloak.token;
  let headers2 = headers.reduce(function (map, obj) { map[obj.key] = obj.value; return map; }, {})

  if (userDetails) {
    var entities = sensorIds.map((s) => {
      return {
        id: s,
        type: "SensingDevice"
      }
    });
    let sub =
      {
        description: desc,
        subject: {
          entities: entities,
          condition: {
            attrs: attrs,
            expression: {
              q: qExpr
            }
          }
        },
        notification: {
          httpCustom: {
            url: url,
            headers: headers2,
            method: "POST",
            payload: URIEncodeForbiddens(payload)
          },
          attrs: attrs
        },
        expires: expires,
        throttling: throttling
      }
    console.log("sub: " + JSON.stringify(sub))
    store.dispatch(actions.createSubscription(sub, userDetails.Service, "/#", accessToken));
  }
}

// URI encode the forbidden characters of Orion
function URIEncodeForbiddens(s) {
  // forbidden characters: <>"\;()
  const forbiddens = ["<", ">", "\"", "\\\\", ";", "\\(", "\\)"]
  return forbiddens.reduce(function (sacc, c) { return replaceAll(sacc, c, encodeURIComponent(c)) }, s)

}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function getNotifications() {
  var userDetails = store.getState().keycloak.idTokenParsed;
  const accessToken = store.getState().keycloak.token;
  const perms = store.getState().keycloak.idTokenParsed.permissions;

  if (userDetails) {
    var service = userDetails.Service;
    //var servicePath = userDetails.ServicePath + "#";
    store.dispatch(actions.getNotifications(perms, service, true, accessToken));
  }
};

//delete a sensor.
export function deleteNotif(notifId) {
  console.log("deleteNotif" + JSON.stringify(notifId));
  const accessToken = store.getState().keycloak.token;
  var userDetails = store.getState().keycloak.idTokenParsed;

  if (userDetails) {
    store.dispatch(actions.deleteNotif(notifId, userDetails.Service, "/", accessToken));
  }
};

function loadUsers() {
  console.log(store.getState().keycloak.realm);
  store.dispatch(actions.getUsers(store.getState().keycloak.realm));
};

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
    { path: 'farmview/:farmid', component: SMComparisonChart },
    { path: 'sensors', component: Sensors },
    { path: 'sensors/:sensorId', component: Sensor },
    { path: 'users', component: UserList, onEnter: loadUsers },
    { path: 'userpermissions', component: UserPermissions },
  ]
}

function displayPage() {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>, document.getElementById('root'));
}

//displayPage();
//
 // url: '/api/v1/keycloak/auth',


var keycloak = Keycloak({
  url: 'http://aam.waziup.io/auth',
  realm: 'watersense',
  clientId: 'dashboard'
});

keycloak.init({ onLoad: 'login-required' }).success(authenticated => {
  if (!authenticated) {
    keycloak.login();
  } else {
    store.getState().keycloak = keycloak;
    setInterval(() => { keycloak.updateToken(10).error(() => keycloak.logout()); }, 10000);
    displayPage();
  }
}).error(function (error) {
  console.log(error);
});

//Authentication
/*ReactJS will see there is no token 
--> NodeJS authentication api endpoint 
--> redirect the call to keycloak login 
--> return token to NodeJS app
--> return this token to ReactJS

save a JWT token in Redux store*/

//user is not authenticated or authenticated
//1. access token in the cookie  to make calls to the server
  //2. or authorization headers, then we can remove server session
//2. serve client from the server. protect the endpoint ()

//<SecurityComponent ... >

//if(objIsEmpty(store.getState().keycloak) === false) {


// } else {
//     const res = await axios.get('/authenticate');
//     //cookie session
//     const data = res.data;
//     store.getState().keycloak
//     await setStateAsync({ data });  
// }

