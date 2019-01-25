import React from 'react';

const rp = require('request-promise');

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

const UTIL = {
  objIsEmpty(obj) {
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  },
  objToArr(obj) {
    return Object.keys(obj).map(k => obj[k]);
  },
  convertVectorBounds(bounds) {
    const n = bounds.map(latlng => [
      latlng.lng, latlng.lat,
    ]);
    n.push([
      bounds[0].lng, bounds[0].lat,
    ]);
    return [n];
  },

  // URI encode the forbidden characters of Orion
  URIEncodeForbiddens(s) {
    // Forbidden characters: <>"\;()
    const forbiddens = [
      '<',
      '>',
      '"',
      '\\\\',
      ';',
      '\\(',
      '\\)',
    ];
    return forbiddens.reduce((sacc, c) => replaceAll(sacc, c, encodeURIComponent(c)), s);
  },
};

export default UTIL;
