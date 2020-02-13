import { routerReducer } from 'react-router-redux';
import * as types from '../actions/actionTypes';

// Get all devices attributes
function deviceAttributesReducer(state = {
  isLoading: false,
  deviceAttributes: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_DEVICE_ATTRIBUTES_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_DEVICE_ATTRIBUTES_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      deviceAttributes: action.data,
      error: false,
    });
    case types.GET_DEVICE_ATTRIBUTES_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get all devices
function devicesReducer(state = {
  isLoading: false,
  devices: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_DEVICES_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_DEVICES_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      devices: action.data,
      error: false,
    });
    case types.GET_DEVICES_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Actions on one device
function deviceReducer(state = {
  isLoading: false,
  msg: {},
  error: false,
}, action = null) {
  switch (action.type) {
    case types.CREATE_DEVICE_START: return Object.assign({}, state, { isLoading: true });
    case types.CREATE_DEVICE_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.CREATE_DEVICE_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.GET_DEVICE_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_DEVICE_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      device: action.data,
      error: false,
    });
    case types.GET_DEVICE_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.UPDATE_DEVICE_START: return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_DEVICE_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.UPDATE_DEVICE_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.DELETE_DEVICE_START: return Object.assign({}, state, { isLoading: true });
    case types.DELETE_DEVICE_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.DELETE_DEVICE_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get devices values
function valuesReducer(state = {
  isLoading: false,
  values: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_VALUES_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_VALUES_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      values: action.data,
      error: false,
    });
    case types.GET_VALUES_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get all projects
function projectsReducer(state = {
  isLoading: false,
  projects: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_PROJECTS_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_PROJECTS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      projects: action.data,
      error: false,
    });
    case types.GET_PROJECTS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get a project
function projectReducer(state = {
  isLoading: false,
  project: [],
  error: false,
  errMsg: '',
}, action = null) {  
  switch (action.type) {
    case types.CREATE_PROJECT_START: return Object.assign({}, state, { isLoading: true });
    case types.CREATE_PROJECT_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.CREATE_PROJECT_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.GET_PROJECT_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_PROJECT_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      project: action.data,
      error: false,
    });
    case types.GET_PROJECT_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.UPDATE_PROJECT_START: return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_PROJECT_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.UPDATE_PROJECT_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.DELETE_PROJECT_START: return Object.assign({}, state, { isLoading: true });
    case types.DELETE_PROJECT_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.DELETE_PROJECT_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get all devices attributes
function gatewayAttributesReducer(state = {
  isLoading: false,
  gatewayAttributes: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_GATEWAY_ATTRIBUTES_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_GATEWAY_ATTRIBUTES_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      gatewayAttributes: action.data,
      error: false,
    });
    case types.GET_GATEWAY_ATTRIBUTES_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get all gateways
function gatewaysReducer(state = {
  isLoading: false,
  gateways: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_GATEWAYS_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_GATEWAYS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      gateways: action.data,
      error: false,
    });
    case types.GET_GATEWAYS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get a gateway
function gatewayReducer(state = {
  isLoading: false,
  gateway: [],
  error: false,
  errMsg: '',
}, action = null) {  
  switch (action.type) {
    case types.CREATE_GATEWAY_START: return Object.assign({}, state, { isLoading: true });
    case types.CREATE_GATEWAY_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.CREATE_GATEWAY_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.GET_GATEWAY_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_GATEWAY_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      gateway: action.data,
      error: false,
    });
    case types.GET_GATEWAY_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.UPDATE_GATEWAY_START: return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_GATEWAY_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.UPDATE_GATEWAY_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.DELETE_GATEWAY_START: return Object.assign({}, state, { isLoading: true });
    case types.DELETE_GATEWAY_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.DELETE_GATEWAY_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get all users
function usersReducer(state = {
  isLoading: false,
  users: [],
  error: false,
}, action = null) {
  switch (action.type) {
    case types.GET_USERS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_USERS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      users: action.data,
      error: false,
    });
    case types.GET_USERS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Actions on one user
function userReducer(state = {
  isLoading: false,
  user: {},
  error: false,
}, action = null) {
  switch (action.type) {
    case types.GET_USER_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_USER_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      user: action.data,
      error: false,
    });
    case types.GET_USER_ERROR: return Object.assign({}, state, {
      isLoading: false,
      user: action.data,
      error: true,
    });
    default: return state;
  }
}

// Get socials
function socialsReducer(state = {
  isLoading: false,
  socials: [],
  error: false,
  errMsg: '',
}, action = null) {
  switch (action.type) {
    case types.GET_SOCIALS_START: return Object.assign({}, state, {
      isLoading: true,
      error: false,
    });
    case types.GET_SOCIALS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      socials: (action.data).reverse(),
      error: false,
    });
    case types.GET_SOCIALS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

function notificationsReducer(state = {
  isLoading: false,
  notifications: [],
  error: false,
}, action = null) {
  switch (action.type) {
    case types.GET_NOTIFS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_NOTIFS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      notifications: action.data,
      error: false,
    });
    case types.GET_NOTIFS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

// Actions on one device
function notificationReducer(state = {
  isLoading: false,
  msg: {},
  error: false,
}, action = null) {
  switch (action.type) {
    case types.GET_NOTIF_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_NOTIF_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      notification: action.data,
      error: false,
    });
    case types.GET_NOTIF_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.CREATE_NOTIF_START: return Object.assign({}, state, { isLoading: true });
    case types.CREATE_NOTIF_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.CREATE_NOTIF_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.UPDATE_NOTIF_START: return Object.assign({}, state, { isLoading: true });
    case types.UPDATE_NOTIF_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.UPDATE_NOTIF_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.DELETE_NOTIF_START: return Object.assign({}, state, { isLoading: true });
    case types.DELETE_NOTIF_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: false,
    });
    case types.DELETE_NOTIF_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

function messagesReducer(state = [], action = null) {
  let error = null,
      msg = null,
      loc = null;
  switch (action.type) {
    case types.CLEAR_MESSAGES: return [];
    // Positive messages
    case types.CREATE_DEVICE_SUCCESS: msg = 'Device created'; error = false; break;
    case types.UPDATE_DEVICE_SUCCESS: msg = 'Device updated'; error = false; break;
    case types.DELETE_DEVICE_SUCCESS: msg = 'Device deleted'; error = false; break;
    case types.CREATE_NOTIF_SUCCESS: msg = 'Notification created'; loc = '/notifications/' + action.data; error = false; break;
    case types.UPDATE_NOTIF_SUCCESS: msg = 'Notification updated'; error = false; break;
    case types.DELETE_NOTIF_SUCCESS: msg = 'Notification deleted'; error = false; break;
    case types.CREATE_USER_SUCCESS: msg = 'New user created'; error = false; break;
    case types.UPDATE_USER_SUCCESS: msg = 'User updated'; error = false; break;
    case types.DELETE_USER_SUCCESS: msg = 'User deleted'; error = false; break;
    case types.CREATE_PROJECT_SUCCESS: msg = 'Project created'; loc = '/projects/' + action.data; error = false; break;
    case types.UPDATE_PROJECT_SUCCESS: msg = 'Project updated'; error = false; break;
    case types.DELETE_PROJECT_SUCCESS: msg = 'Project deleted'; error = false; break;
    case types.CREATE_GATEWAY_SUCCESS: msg = 'Gateway created'; error = false; break;
    case types.DELETE_GATEWAY_SUCCESS: msg = 'Gateway deleted'; error = false; break;
    case types.UPDATE_GATEWAY_SUCCESS: msg = 'Gateway updated'; error = false; break;

    // Error cases
    case types.GET_DEVICES_ERROR: msg = 'Error when fetching devices'; error = true; break;
    case types.GET_DEVICE_ERROR: msg = 'Error when fetching a device'; error = true; break;
    case types.CREATE_DEVICE_ERROR: msg = 'Error when creating device'; error = true; break;
    case types.UPDATE_DEVICE_ERROR: msg = 'Error when updating device'; error = true; break;
    case types.DELETE_DEVICE_ERROR: msg = 'Error when deleting device'; error = true; break;
    case types.GET_VALUES_ERROR: msg = 'Error when fetching device values'; error = true; break;
    case types.GET_NOTIFS_ERROR: msg = 'Error when fetching notifications'; error = true; break;
    case types.GET_NOTIF_ERROR: msg = 'Error when fetching a notification'; error = true; break;
    case types.CREATE_NOTIF_ERROR: msg = 'Error when creating notification'; error = true; break;
    case types.UPDATE_NOTIF_ERROR: msg = 'Error when updating notification'; error = true; break;
    case types.DELETE_NOTIF_ERROR: msg = 'Error when deleting notification'; error = true; break;
    case types.GET_USERS_ERROR: msg = 'Error when fetching users'; error = true; break;
    case types.GET_USER_ERROR: msg = 'Error when fetching user infos'; error = true; break;
    case types.GET_DEVICE_PERMS_ERROR: msg = 'Error when fetching user permissions'; error = true; break;
    case types.CREATE_USER_ERROR: msg = 'Error when creating user'; error = true; break;
    case types.UPDATE_USER_ERROR: msg = 'Error when updating user'; error = true; break;
    case types.DELETE_USER_ERROR: msg = 'Error when deleting user'; error = true; break;
    case types.CREATE_PROJECT_ERROR: msg = 'Error when creating project'; error = true; break;
    case types.UPDATE_PROJECT_ERROR: msg = 'Error when updating project'; error = true; break;
    case types.DELETE_PROJECT_ERROR: msg = 'Error when deleting project'; error = true; break;
    case types.CREATE_GATEWAY_ERROR: msg = 'Error when creating gateway'; error = true; break;
    case types.UPDATE_GATEWAY_ERROR: msg = 'Error when updating gateway'; error = true; break;
    case types.DELETE_GATEWAY_ERROR: msg = 'Error when deleting gateway'; error = true; break;

    default: return state;
  }
  if (error) {
    let errorContext = null;
    if (action.data.response) {
      console.error(action.data.response);
      errorContext = `${action.data.response.status} ${action.data.response.text}`;
      return [...state, {msg: `${msg}: ${errorContext}`, error: true}];
    } else {
      // errorContext = 'Client error. Please check web console for details.';
      //Client errors (bugs in the code etc.) are reported in the console.
      console.error(`client error: ${action.data}`);
      return state;
    }
  } else {
    return [...state, {msg: msg, error: false, loc: loc}];
  }
}

// Get all permissions
function permissionsReducer(state = {
  isLoading: false,
  device: [],
  project: [],
  gateway: [],
  error: false,
}, action = null) {
  switch (action.type) {
    case types.GET_PROJECT_PERMS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_PROJECT_PERMS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      project: action.data,
      error: false,
    });
    case types.GET_PROJECT_PERMS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.GET_DEVICE_PERMS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_DEVICE_PERMS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      device: action.data,
      error: false,
    });
    case types.GET_DEVICE_PERMS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    case types.GET_GATEWAY_PERMS_START: return Object.assign({}, state, { isLoading: true });
    case types.GET_GATEWAY_PERMS_SUCCESS: return Object.assign({}, state, {
      isLoading: false,
      gateway: action.data,
      error: false,
    });
    case types.GET_GATEWAY_PERMS_ERROR: return Object.assign({}, state, {
      isLoading: false,
      msg: action.data,
      error: true,
    });
    default: return state;
  }
}

function settingsReducer(state = {allowManualCreateResources: false, showPublicResources: false}, action = null) {
  switch (action.type) {
    case types.SET_SETTINGS: return action.settings;
    default: return state;
  }
}

export default function rootReducer(state = {}, action) {
  if (action.type === types.USER_LOGOUT) {
    state = {};
  }
  return {
    routing: routerReducer(state.routing, action),
    keycloak: state.keycloak,
    current_user: state.current_user,
    settings: settingsReducer(state.settings, action),
    // List of device attributes
    deviceAttributes: deviceAttributesReducer(state.deviceAttributes, action),
    // List of devices
    devices: devicesReducer(state.devices, action),
    // Device CRUD operations
    device: deviceReducer(state.device, action),
    // Device values
    values: valuesReducer(state.values, action),
    // List of projects
    projects: projectsReducer(state.projects, action),
    // List of project
    project: projectReducer(state.project, action),
    // List of gateway attributes
    gatewayAttributes: gatewayAttributesReducer(state.gatewayAttributes, action),
    // List of gateways
    gateways: gatewaysReducer(state.gateways, action),
    // A single gateway
    gateway: gatewayReducer(state.gateway, action),
    // Current user
    user: userReducer(state.user, action),
    // List of users
    users: usersReducer(state.users, action),
    // List of socials
    socials: socialsReducer(state.socials, action),
    // List of notifications
    notifications: notificationsReducer(state.notifications, action),
    // Notif CRUD operations
    notification: notificationReducer(state.notification, action),
    // global messages
    messages: messagesReducer(state.messages, action),
    // List of permissions
    permissions: permissionsReducer(state.permissions, action)
  };
}
