/**
 * Global Util Functions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
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
      console.log(response);
      if (response.status >= 200 && response.status < 300) {
              return response;
            } else {
              let error = new Error(response.status);
              error.response = response;
              throw error;
            }
     },
    getMeasurement: function(sensor){
        var returnValue = [];
        for(var i in sensor){
          if (i!=='id'&&i!=='type'&&i!=='owner'&&i!=='last_value'&&i!=='location') {
            returnValue.push({"key": i, "value": sensor[i]})
            }
          }
        return returnValue;
        }
};

/* Export ==================================================================== */
module.exports = UTIL;
module.exports.details = {
  title: 'UTIL'
};
