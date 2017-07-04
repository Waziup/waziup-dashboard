import React from 'react';

const UTIL = {
	/**
	  * Test if Obj is empty
	  */
	objIsEmpty: function(obj) {
	  for(let prop in obj) {
	    if(obj.hasOwnProperty(prop))
	      return false;
	  }
	  return true;
	},

	/**
	  * Convert Obj to Arr
	  */
	objToArr: function(obj) {
	  return Object.keys(obj).map(function(k) { return obj[k] });
	},

	/**
	  * Get First Item in Object
	  */
	firstIndexInObj: function(obj) {
	  for (let a in obj) return a;
	},
    /**
     *  check status of a request
     *
     */
    checkStatus: function(response) {
      if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              let error = new Error(response.status);
              error.response = response;
              throw error;
            }
     },
    convertVectorBounds: function(bounds){
       var n = []
       bounds.map((latlng)=>{
            n.push([latlng.lat,latlng.lng]);
       })
       return n;
    },

    // Get all measurements for a sensor
    // an attribute is considered as a measurement if it has a timestamp metadata
    getMeasurements: function(sensor){
        var returnValue = [];
        const attributesExcludes = ["id", "type", "location", "dateCreated", "dateModified", "owner", "servicePath"];
        for(var i in sensor){
          if (attributesExcludes.indexOf(i) === -1 && sensor[i]) {
            returnValue.push({"key": i, "value": sensor[i].value})
          }
        }
        return returnValue;
    },

    //Griddle table config
    styleConfig: function() {
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
          Table: { width: "100%",  border: "1px solid #dddddd ", padding: "5px"},
          Cell: { border: "1px solid #ededef ", padding: "5px", "background-color": "#FFFFFF" },
        }
      }
    },

    getSensorData: function(sensor) {
      var returnValue = [];
      var meas = UTIL.getMeasurements(sensor);
      for(var i in meas){
          returnValue.push(
             <li> {meas[i].key + ": " + meas[i].value} </li>
          )
      }
      return returnValue;
    }
};

/* Export ==================================================================== */
module.exports = UTIL;
module.exports.details = {
  title: 'UTIL'
};
