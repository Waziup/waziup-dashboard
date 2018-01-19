import * as actions from './actions/actions';
import UTIL from './lib/utils.js';

// load all sensors in the store, using service and servicePath from the user attributes.
// if isAllSensors == true, the sensors with the same servicePath as the user or un sub-paths are loaded.
// if isAllSensors == false, the sensors with the strictly same servicePath as the user are loaded.
//export const loadSensors = (isAllSensors, user) => (dispatch) => {
//  //console.log("loadsensors" + JSON.stringify(user));
//  if (user) {
//    //var servicePath = userDetails.ServicePath + (isAllSensors?"#":"");
//    dispatch(actions.fetchSensors(user.permissions, user.Service, isAllSensors));
//  }
//};

//export const updateSensorFarmAction = (service, sp, sensorId, values) => (dispatch) => {
//  let attribute = {
//    farmingAction: {
//      type: "object",
//      value: {
//        description: {
//          type: "string",
//          value: values.description
//        },
//        quantity: {
//          type: "string",
//          value: values.quantity
//        },
//        eventType: {
//          type: "string",
//          value: values.eventType
//        },
//      },
//      metadata: {
//        timestamp: {
//          type: "DateTime",
//          value: values.date
//        }
//      }
//    }
//  }
//  dispatch(actions.updateSensorAttributes(sensorId, attribute, service, sp));
//}
//
//export const updateFarm = (field, farmId, service) => (dispatch) => {
//  //type: 'Farm',    id: farmId,
//
//  console.log(service, farmId, JSON.stringify(field));
//  let farmAttributes = {
//    name: {
//      type: "string",
//      value: field.name
//    },
//    
//    /*location: {
//      value: {
//        type: "Polygon",
//        coordinates: field.LayerField
//      },
//      type: "geo:json"
//    },
//    owner: {
//      type: "string",
//      value: user.preferred_username
//    },*/
//    servicePath: {
//      type: "string",
//      value: field.servicePath
//    },
//    crop: {
//      type: "string",
//      value: field.crop
//    },
//    address: {
//      type: "string",
//      value: field.address
//    },
//    irrigationType: {
//      type: "string",
//      value: field.irrigationType
//    },
//    overDryZone: {
//      type: "Number",
//      value: field.overDryZone
//    },
//    overIrrigationZone: {
//      type: "Number",
//      value: field.overIrrigationZone
//    }
//  }
//
//  console.log('farmAttributes', farmAttributes, farmId, service, field.servicePath);
//  dispatch(actions.updateSensorAttributes(farmId, farmAttributes, service, field.servicePath));
//}


// Create a sensor with the given parameters.
// the user's service and servicePath will be used.
//export const createSensor = (sensor, user) => (dispatch) => {
//  //console.log("create sensor");
//  //console.log("user", JSON.stringify(user));
//  
//  dispatch(actions.createSensor(sensor));
//}

// selectFarm 

//export const selectFarm = (farm) => (dispatch) => {
//  console.log("selectFarm" + JSON.stringify(farm));
//  dispatch(actions.selectFarm(farm));
//};
//
//export const createFarm = (field, user) => (dispatch) => {
//    var field2 = {
//      id: UTIL.getFarmName(user.Service, field.servicePath),
//      name: {
//        type: "string",
//        value: field.name
//      },
//      type: 'Farm',
//      location: {
//        value: {
//          type: "Polygon",
//          coordinates: field.LayerField
//        },
//        type: "geo:json"
//      },
//      owner: {
//        type: "string",
//        value: user.preferred_username
//      },
//      servicePath: {
//        type: "string",
//        value: field.servicePath
//      },
//      crop: {
//        type: "string",
//        value: field.crop
//      },
//      address: {
//        type: "string",
//        value: field.address
//      },
//      irrigationType: {
//        type: "string",
//        value: field.irrigationType
//      },
//      overDryZone: {
//        type: "number",
//        value: field.overDryZone
//      },
//      overIrrigationZone: {
//        type: "number",
//        value: field.overIrrigationZone
//      }
//    }
//    console.log("creating field:" + field2);
//    dispatch(actions.createSensor(field2, user.Service, field.servicePath));
//  
//}
//
////delete a sensor.
//export const deleteSensor = (sensorId, servicePath, user) => (dispatch) => {
//  console.log("deleteSensors" + JSON.stringify(sensorId));
//
//  if (user) {
//    dispatch(actions.deleteSensor(sensorId, user.Service, servicePath));
//  }
//};
//
////update the sensor location
//export const updateSensorLocation = (values, user) => (dispatch) => {
//  if (user) {
//    let attribute = {
//      location: {
//        value: {
//          type: "Point",
//          coordinates: [values.sensorLon, values.sensorLat]
//        },
//        type: "geo:json"
//      }
//    }
//
//    dispatch(actions.updateSensorAttributes(values.sensorId, attribute, user.Service, values.servicePath));
//  }
//}
//
////update the sensor owner
//export const updateSensorOwner = (sensorId, servicePath, user) => (dispatch) => {
//
//  if (user) {
//    let attribute = {
//      owner: {
//        type: "string",
//        value: user.preferred_username,
//      }
//    }
//
//    dispatch(actions.updateSensorAttributes(sensorId, attribute, user.Service, servicePath));
//  }
//}

export const createNotif = (desc, sensorIds, attrs, qExpr, phone, message, expires, throttling, user) => (dispatch) => {

  //notifications are hard-coded to Plivo for now
  let url = "https://api.plivo.com/v1/Account/MAMDA5ZDJIMDM1NZVMZD/Message/"
  let headers = [{ key: "Content-type", value: "application/json" },
  { key: "Authorization", value: "Basic TUFNREE1WkRKSU1ETTFOWlZNWkQ6TnpSbE5XSmlObVUyTW1GallXSmxPRGhsTlRrM01Ua3laR0V6TnpJeQ==" }]
  let payload = "{ \"src\": \"00393806412092\", \"dst\": \"" + phone + "\", \"text\": \"" + message + "\"}"
  let throttling = 3600 * 24 //maximum one message a day

  let headers2 = headers.reduce(function (map, obj) { map[obj.key] = obj.value; return map; }, {})

  if (user) {
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
            payload: UTIL.URIEncodeForbiddens(payload)
          },
          attrs: attrs
        },
        expires: expires,
        throttling: throttling
      }
    console.log("sub: " + JSON.stringify(sub))
    dispatch(actions.createSubscription(sub, user.Service, "/#"));
  }
}

export const loadNotifs = (user) => (dispatch) => {
  //console.log("loadNotifications");
  if (user) {
    dispatch(actions.getNotifications(user.permissions, user.Service, true));
  }
};

//delete a sensor.
export const deleteNotif = (notifId, user) => (dispatch) => {
  console.log("deleteNotif" + JSON.stringify(notifId));
  if (user) {
    dispatch(actions.deleteNotif(notifId, user.Service, "/"));
  }
};

export const loadUsers = (realm) => (dispatch) => {
  dispatch(actions.getUsers(realm));
};

export const deleteUser = (uid, realm) => (dispatch) => {
  dispatch(actions.deleteUser(realm, uid));
};

