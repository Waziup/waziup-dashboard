import React from 'react';
const rp = require('request-promise');

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const UTIL = {
  objIsEmpty: function (obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop))
        return false;
    }
    return true;
  },
  objToArr: function (obj) {
    return Object.keys(obj).map(function (k) { return obj[k] });
  },
  convertVectorBounds: function (bounds) {
    var n = bounds.map((latlng) => ([latlng.lng, latlng.lat]))
    n.push([bounds[0].lng, bounds[0].lat]);
    return [n];
  },

// URI encode the forbidden characters of Orion
 URIEncodeForbiddens(s) {
  // forbidden characters: <>"\;()
  const forbiddens = ["<", ">", "\"", "\\\\", ";", "\\(", "\\)"]
  return forbiddens.reduce(function (sacc, c) { return replaceAll(sacc, c, encodeURIComponent(c)) }, s)

}
};

export default UTIL
