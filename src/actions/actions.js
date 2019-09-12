import * as WaziupApi from 'waziup-js';
import * as types from './actionTypes';
import config from '../config.js';
import { store } from '../index.js';

const defaultClient = WaziupApi.ApiClient.instance;
defaultClient.basePath = `${config.APIServerUrl}/v2`;

const projectsApi = new WaziupApi.ProjectsApi();
const devicesApi = new WaziupApi.DevicesApi();
const gatewaysApi = new WaziupApi.GatewaysApi();
const sensorsApi = new WaziupApi.SensorsApi();
const actuatorsApi = new WaziupApi.ActuatorsApi();
const usersApi = new WaziupApi.UsersApi();
const notifsApi = new WaziupApi.NotificationsApi();
const authApi = new WaziupApi.AuthApi();

export function logout() {
  return async function (dispatch) {
    dispatch({ type: types.USER_LOGOUT });
  };
}

/* Device Actions */

export function getDeviceAttributes(params) {
  return async function (dispatch) {
    if (!params) {
      params = { limit: 1000 };
    }
    dispatch({ type: types.GET_DEVICE_ATTRIBUTES_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const result = await devicesApi.getDevices(params);
      const domains = [...new Set(result.map(s => s.domain))];
      const owners =  [...new Set(result.map(s => s.owner))];
      const ids =     [...new Set(result.map(s => s.id))];
      const names =   [...new Set(result.map(s => s.name))];
      const data = {domains,owners,ids,names}
      dispatch({ type: types.GET_DEVICE_ATTRIBUTES_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_DEVICE_ATTRIBUTES_ERROR, data: error });
    }
  };
}

export function getDevices(params) {
  return async function (dispatch) {
    if (!params) {
      params = { limit: 1000 };
    }
    dispatch({ type: types.GET_DEVICES_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.getDevices(params);      
      dispatch({ type: types.GET_DEVICES_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_DEVICES_ERROR, data: error });
    }
  };
}

export function createDevice(device) {
  return async function (dispatch) {
    dispatch({ type: types.CREATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.createDevice(device);
      dispatch({ type: types.CREATE_DEVICE_SUCCESS, data });
      dispatch(getDevices({ limit: 1000 }));
      dispatch(getDevicePermissions());
    } catch (error) {
      dispatch({ type: types.CREATE_DEVICE_ERROR, data: error });
    }
  };
}

export function getDevice(id) {
  return async function (dispatch) {
    dispatch({ type: types.GET_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.getDevice(id);
      dispatch({ type: types.GET_DEVICE_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_DEVICE_ERROR, data: error });
    }
  };
}

export function updateDeviceLocation(deviceId, location) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.putDeviceLocation(deviceId, location);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateDeviceOwner(deviceId, owner) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.putDeviceOwner(deviceId, owner);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateDeviceName(deviceId, name) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.putDeviceName(deviceId, name);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateDeviceVisibility(deviceId, visibility) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.putDeviceVisibility(deviceId, visibility);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateDeviceGatewayId(deviceId, gateway_id) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.putDeviceGatewayId(deviceId, gateway_id);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function deleteDevice(deviceId) {
  return async function (dispatch) {
    dispatch({ type: types.DELETE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.deleteDevice(deviceId);
      dispatch({ type: types.DELETE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.DELETE_DEVICE_ERROR, data: error });
    }
  };
}

/* Sensor actions */

export function addSensor(deviceId, sens) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await sensorsApi.addSensor(deviceId, sens);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function deleteSensor(deviceId, sensId) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await sensorsApi.deleteSensor(deviceId, sensId);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateSensorName(deviceId, sensId, name) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await sensorsApi.putSensorName(deviceId, sensId, name);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateSensorCalibration(deviceId, sensId, calib) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await sensorsApi.putSensorCalibration(deviceId, sensId, calib);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

/* Actuator actions */

export function addActuator(deviceId, actu) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.addActuator(deviceId, actu);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevice(deviceId));
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function deleteActuator(deviceId, actuId) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.deleteActuator(deviceId, actuId);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateActuatorName(deviceId, actuId, name) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.putActuatorName(deviceId, actuId, name);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateActuatorKind(deviceId, actuId, kind) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.putActuatorKind(deviceId, actuId, kind);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateActuatorValue(deviceId, actuId, value) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.createActuatorValue(deviceId, actuId, value);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

export function updateActuatorValueType(deviceId, actuId, valueType) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_DEVICE_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await actuatorsApi.putActuatorVT(deviceId, actuId, valueType);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

/* device values action */

export function getValues(options) {
  return async function (dispatch) {
    dispatch({ type: types.GET_VALUES_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await sensorsApi.getSensorsData(options);
      dispatch({ type: types.GET_VALUES_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_VALUES_ERROR, data: error });
    }
  };
}


/* User actions */

export function getUsers() {
  return async function (dispatch) {
    const  params = { limit: 1000 };
    dispatch({ type: types.GET_USERS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await usersApi.getUsers(params);
      dispatch({ type: types.GET_USERS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_USERS_ERROR, data: error });
    }
  };
}

export function getUser(id) {
  return async function (dispatch) {
    dispatch({ type: types.GET_USER_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await usersApi.getUser(id);
      dispatch({ type: types.GET_USER_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_USER_ERROR, data: error });
    }
  };
}

export function updateUser(userid, user) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_USER_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await usersApi.updateUser(userid, user);
      dispatch({ type: types.UPDATE_USER_SUCCESS, data });
      dispatch(getUsers());
    } catch (error) {
      dispatch({ type: types.UPDATE_USER_ERROR, data: error });
    }
  };
}

export function deleteUser(userid) {
  return async function (dispatch) {
    dispatch({ type: types.DELETE_USER_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await usersApi.deleteUsers(userid);
      dispatch({ type: types.DELETE_USER_SUCCESS, data });
      dispatch(getUsers());
    } catch (error) {
      dispatch({ type: types.DELETE_USER_ERROR, data: error });
    }
  };
}


/* Project actions */

export function getProjects(params) {
  if (!params) {
    params = { limit: 1000 };
  }
  return async function (dispatch) {
    dispatch({ type: types.GET_PROJECTS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.getProjects(params);
      dispatch({ type: types.GET_PROJECTS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_PROJECTS_ERROR, data: error });
    }
  };
}


export function getProject(id, params) {
  return async function (dispatch) {
    dispatch({ type: types.GET_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.getProject(id, params);
      dispatch({ type: types.GET_PROJECT_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_PROJECT_ERROR, data: error });
    }
  };
}

export function createProject(proj) {
  return async function (dispatch) {
    dispatch({ type: types.CREATE_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.createProject(proj);
      dispatch({ type: types.CREATE_PROJECT_SUCCESS, data });
      dispatch(getProjects());
      dispatch(getProjectPermissions());
    } catch (error) {
      dispatch({ type: types.CREATE_PROJECT_ERROR, data: error });
    }
  };
}

export function deleteProject(projectId) {
  return async function (dispatch) {
    dispatch({ type: types.DELETE_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.deleteProject(projectId);
      dispatch({ type: types.DELETE_PROJECT_SUCCESS, data });
      dispatch(getProjects());
    } catch (error) {
      dispatch({ type: types.DELETE_PROJECT_ERROR, data: error });
    }
  };
}

export function updateProjectDevices(projectId, devices) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.putDeviceIds(projectId, devices);
      dispatch({ type: types.UPDATE_PROJECT_SUCCESS, data });
      dispatch(getProjects());
    } catch (error) {
      dispatch({ type: types.UPDATE_PROJECT_ERROR, data: error });
    }
  };
}

export function updateProjectGateways(projectId, gateways) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.putGatewayIds(projectId, gateways);
      dispatch({ type: types.UPDATE_PROJECT_SUCCESS, data });
      dispatch(getProjects());
    } catch (error) {
      dispatch({ type: types.UPDATE_PROJECT_ERROR, data: error });
    }
  };
}

export function updateProjectName(projectId, name) {
  return async function (dispatch) {
    dispatch({ type: types.UPDATE_PROJECT_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await projectsApi.putProjectName(projectId, name);
      dispatch({ type: types.UPDATE_PROJECT_SUCCESS, data });
      dispatch(getProjects());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

/* Gateway actions */

export function getGateways() {
  return async function (dispatch) {
    dispatch({ type: types.GET_GATEWAYS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await gatewaysApi.getGateways();
      dispatch({ type: types.GET_GATEWAYS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_GATEWAYS_ERROR, data: error });
    }
  };
}

export function getGateway(id) {
  return async function (dispatch) {
    dispatch({ type: types.GET_GATEWAY_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await gatewaysApi.getGateway(id);
      dispatch({ type: types.GET_GATEWAY_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_GATEWAY_ERROR, data: error });
    }
  };
}

export function createGateway(proj) {
  return async function (dispatch) {
    dispatch({ type: types.CREATE_GATEWAY_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await gatewaysApi.createGateway(proj);
      dispatch({ type: types.CREATE_GATEWAY_SUCCESS, data });
      dispatch(getGateways());
    } catch (error) {
      dispatch({ type: types.CREATE_GATEWAY_ERROR, data: error });
    }
  };
}

export function deleteGateway(projectId) {
  return async function (dispatch) {
    dispatch({ type: types.DELETE_GATEWAY_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await gatewaysApi.deleteGateway(projectId);
      dispatch({ type: types.DELETE_GATEWAY_SUCCESS, data });
      dispatch(getGateways());
    } catch (error) {
      dispatch({ type: types.DELETE_GATEWAY_ERROR, data: error });
    }
  };
}

/* Notification actions */

export function getNotifs() {
  return async function (dispatch) {
    const  params = { limit: 1000 };
    dispatch({ type: types.GET_NOTIFS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await notifsApi.getNotifications(params);
      dispatch({ type: types.GET_NOTIFS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_NOTIFS_ERROR, data: error });
    }
  };
}

export function createNotif(notif) {
  return async function (dispatch) {
    dispatch({ type: types.CREATE_NOTIF_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await notifsApi.createNotification(notif);
      dispatch({ type: types.CREATE_NOTIF_SUCCESS, data });
      dispatch(getNotifs());
    } catch (error) {
      dispatch({ type: types.CREATE_NOTIF_ERROR, data: error });
    }
  };
}

export function deleteNotif(notifId) {
  return async function (dispatch) {
    dispatch({ type: types.DELETE_NOTIF_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await notifsApi.deleteNotification(notifId);
      dispatch({ type: types.DELETE_NOTIF_SUCCESS, data });
      dispatch(getNotifs());
    } catch (error) {
      dispatch({ type: types.DELETE_NOTIF_ERROR, data: error });
    }
  };
}

export function clearMessages() {
  return async function (dispatch) {
    dispatch({ type: types.CLEAR_MESSAGES });
  };
}

export function getProjectPermissions() {
  return async function (dispatch) {
    dispatch({ type: types.GET_PROJECT_PERMS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await authApi.getProjectPermissions();
      dispatch({ type: types.GET_PROJECT_PERMS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_PROJECT_PERMS_ERROR, data: error });
    }
  };
}

export function getDevicePermissions() {
  return async function (dispatch) {
    dispatch({ type: types.GET_DEVICE_PERMS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await authApi.getDevicePermissions();
      dispatch({ type: types.GET_DEVICE_PERMS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_DEVICE_PERMS_ERROR, data: error });
    }
  };
}

export function getGatewayPermissions() {
  return async function (dispatch) {
    dispatch({ type: types.GET_GATEWAY_PERMS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await authApi.getGatewayPermissions();
      dispatch({ type: types.GET_GATEWAY_PERMS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_GATEWAY_PERMS_ERROR, data: error });
    }
  };
}
