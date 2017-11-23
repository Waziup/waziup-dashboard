import React from 'react';
const rp = require('request-promise');

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const UTIL = {
	/**
	  * Test if Obj is empty
	  */
  objIsEmpty: function (obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  },

	/**
	  * Convert Obj to Arr
	  */
  objToArr: function (obj) {
    return Object.keys(obj).map(function (k) { return obj[k] });
  },

	/**
	  * Get First Item in Object
	  */
  firstIndexInObj: function (obj) {
    for (let a in obj) return a;
  },
  /**
   *  check status of a request
   *
   */
  checkStatus: function (response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.status);
      error.response = response;
      throw error;
    }
  },
  convertVectorBounds: function (bounds) {
    var n = bounds.map((latlng) => ([latlng.lng, latlng.lat]))
    n.push([bounds[0].lng, bounds[0].lat]);
    return [n];
  },

  // Get all measurements for a sensor
  // an attribute is considered as a measurement if it has a timestamp metadata
  getMeasurements: function (sensor) {
    var returnValue = [];
    const attributesExcludes = ["id", "type", "location", "dateCreated", "dateModified", "owner", "servicePath"];
    for (var i in sensor) {
      if (attributesExcludes.indexOf(i) === -1 && sensor[i]) {
        returnValue.push({ "key": i, "value": sensor[i].value })
      }
    }
    return returnValue;
  },

  //Griddle table config
  styleConfig: function () {
    return {
      icons: {
        TableHeadingCell: {
          sortDescendingIcon: '▼',
          sortAscendingIcon: '▲',
        },
      },
      classNames: {
        Row: 'row-class',
        Table: 'table-striped, table',
      },
      styles: {
        Filter: { fontSize: 18 },
        Table: { width: "100%", border: "1px solid #dddddd ", padding: "5px" },
        Cell: { border: "1px solid #ededef ", padding: "5px", "background-color": "#FFFFFF" },
      }
    }
  },
  getFarmData: function (sensor) {
    const returnValue = [];
    returnValue.push(<li key={sensor.name.value}> {"FARM Name: " + sensor.name.value} </li>)
    returnValue.push(<li key={sensor.owner.value}> {"Owner: " + sensor.owner.value} </li>)
    returnValue.push(<li key={sensor.irrigationType.value}> {"Irrigation Type: " + sensor.irrigationType.value} </li>)
    returnValue.push(<li key={sensor.crop.value}> {"Crops: " + sensor.crop.value} </li>)
    returnValue.push(<li key={sensor.address.value}> {"Address: " + sensor.address.value} </li>)
    return returnValue;
  },
  getSensorData: function (sensor) {
    var returnValue = [];
    var meas = UTIL.getMeasurements(sensor);
    for (var i in meas) {
      returnValue.push(
        <li key={meas[i].key}> {meas[i].key + ": " + meas[i].value} </li>
      )
    }
    return returnValue;
  },
  getPermPairs: function (permString) {
    if (permString === undefined)
      return '';

    const permPairs = permString.split(/\s*;\s*/).map(permPair => permPair.split(/\s*:\s*/))
    return permPairs;
  },

  getPermMap: function (permString) {
    const permissions = {};

    if (permString === undefined)
      return permissions;

    const permPairs = this.getPermPairs(permString);

    for (const permPair of permPairs) {
      const key = permPair[0];
      const value = permPair[1];

      if (!(key in permissions)) {
        permissions[key] = [];
      }

      if (value !== undefined) {
        permissions[key].push(value);
      }
    }

    return permissions;
  }, //search
  getViewServicePaths: function (permString) {
    let servicePaths = new Set();

    if (permString === undefined)
      return servicePaths;

    const permPairs = this.getPermPairs(permString);

    for (const permPair of permPairs) {
      const role = permPair[0];
      let sp = ''
      if (!!permPair[1]) //Object.values(permPair[1]).length !== 0)
        sp = permPair[1];//.toUpperCase();

      if (!!role === false)
        continue;

      switch (role) {
        case 'admin':
          servicePaths.clear();
          servicePaths.add("/");
          return servicePaths;
        case 'advisor':
          servicePaths.add(sp);
          break;
        case 'farmer':
          servicePaths.add(sp);
          break;
        default:
          servicePaths.add(sp);
      }
    }

    return servicePaths;
  },
  //according to user's role, for creation, and update operations
  getEditServicePaths: function (permString, allSps) {
    let editSps = new Set(allSps);

    if (permString === undefined)
      return [];

    const permPairs = this.getPermPairs(permString);

    for (const permPair of permPairs) {
      const role = permPair[0];
      if (!!role === false)
        continue;

      let sp = ''
      if (!!permPair[1])
        sp = permPair[1].toUpperCase();

      switch (role) {
        case 'admin':
          return allSps;
        case 'farmer':
          editSps.delete(sp);
          break;
        case 'advisor':
          editSps.add(sp);
          break;
        default:
          break;
      }
    }

    return editSps;
  },
  async fetchSps(service, servicePath) {
    try {
      const resp = await rp({
        uri: `api/v1/orion/v2/entities?attrs=servicePath`,
        headers: {
          'Fiware-Service': service,
          'Fiware-ServicePath': servicePath
        },
        json: true
      });

      const spSet = new Set();

      for (const entry of resp) {
        spSet.add(entry.servicePath.value);
      }

      //console.log(spSet);
      return spSet;
    } catch (err) {
      //log.error(err);
      return [];
    }
  }
  ,
  getIndex(service, servicePath) {
    let index = service;
    if (servicePath !== '/') {
      const spPart = servicePath.replace(/\//g, "-");
      index = index.concat(spPart);
    }
    return index.toLowerCase();
  },

  getFarmName(service, servicePath) {
    let name = 'FARM-'.concat(this.getIndex(service, servicePath).toUpperCase());
    return name;
  },

  getServicePath(service, newIndex) {
    let sp = newIndex.replace(service, '');
    sp = sp.replace(/-/g, "/").toUpperCase();
    return sp;
  },

  isAdmin(permString) {
    const permPairs = this.getPermMap(permString);
    return permPairs.hasOwnProperty('admin')
  },

  isAdvisor(permString) {
    const permPairs = this.getPermMap(permString);
    return permPairs.hasOwnProperty('advisor')
  },

  isFarmer(permString) {
    const permPairs = this.getPermMap(permString);
    return permPairs.hasOwnProperty('farmer')
  },

  convertLonLatToLatLon(coordinates) {
    var n = [];
    coordinates.map((coords) => {
      console.log(coords[0]);
      coords.map((item) => {
        n.push([item[1], item[0]]);
      })
    })
    return [n];
  },
  readingToPercent(r) {
    let v = 0;
    const reading = parseFloat(r);

    if (reading <= 100)
        v = 100;
    else if (reading <= 500)
        v = Math.ceil(120 - 0.2 * reading);
    else
        v = Math.ceil(40 - 0.04 * reading);

    return v
},
// URI encode the forbidden characters of Orion
 URIEncodeForbiddens(s) {
  // forbidden characters: <>"\;()
  const forbiddens = ["<", ">", "\"", "\\\\", ";", "\\(", "\\)"]
  return forbiddens.reduce(function (sacc, c) { return replaceAll(sacc, c, encodeURIComponent(c)) }, s)

}
};

export default UTIL
