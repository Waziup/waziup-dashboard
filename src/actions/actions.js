import * as WaziupApi from 'waziup-js';
import * as types from './actionTypes';
import config from '../config.js';
import { store } from '../index.js';

const defaultClient = WaziupApi.ApiClient.instance;
defaultClient.basePath = `${config.APIServerUrl}/v2`;

const devicesApi = new WaziupApi.DevicesApi();
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
      const owners = [...new Set(result.map(s => s.owner))];
      const ids = [...new Set(result.map(s => s.id))];
      const names = [...new Set(result.map(s => s.name))];
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
      console.log(data);
      
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
      dispatch(getPermissions());
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
      const data = await devicesApi.putDeviceVisility(deviceId, visibility);
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
      const data = await devicesApi.addSensor(deviceId, sens);
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
      const data = await devicesApi.deleteSensor(deviceId, sensId);
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
      const data = await devicesApi.putSensorName(deviceId, sensId, name);
      dispatch({ type: types.UPDATE_DEVICE_SUCCESS, data });
      dispatch(getDevices());
    } catch (error) {
      dispatch({ type: types.UPDATE_DEVICE_ERROR, data: error });
    }
  };
}

/* device values action */

export function getValues(deviceId, sensId, options) {
  return async function (dispatch) {
    dispatch({ type: types.GET_VALUES_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await devicesApi.getSensorValues(deviceId, sensId, options);
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

export function getPermissions() {
  return async function (dispatch) {
    dispatch({ type: types.GET_PERMS_START });
    defaultClient.authentications.Bearer.apiKey = `Bearer ${store.getState().keycloak.token}`;
    try {
      const data = await authApi.getPermissions();
      dispatch({ type: types.GET_PERMS_SUCCESS, data });
    } catch (error) {
      dispatch({ type: types.GET_PERMS_ERROR, data: error });
    }
  };
}
