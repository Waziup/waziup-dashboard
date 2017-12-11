"use strict";
const users = require('./users');
const auth = require('./auth');
const express = require('express');
const access = require('../../lib/access');
const { adminProtection } = access;

/*var settings = {
    baseUrl: config.get('keycloak.host'),
    username: config.get('keycloak.adminid'),
    password: config.get('keycloak.adminpassword'),
    grant_type: 'password',
    client_id: 'admin-cli'
}*/

var settings = {
    baseUrl: 'http://localhost:8080/auth',
    username: 'admin',
    password: 'admin',
    grant_type: 'password',
    client_id: 'admin-cli'
}


function install(router, baseUrl, keycloak) {
   //FIXME based on user's role make appropriate autorization
   router.use(baseUrl, adminProtection(keycloak), function (req, res, next) {
       console.log('%s URI: %s PATH: %s HEADERS: %s BODY: %s', req.method, req.url,
           req.path, JSON.stringify(req.headers), JSON.stringify(req.body));
       auth(settings).then(r => {
           req.headers['Authorization'] = 'Bearer '.concat(r)
           next();
       });
   });
   
   /*for the search you post a json like 
   body = {
       "id": "269c1d25-04e9-43bf-b103-2c1468c9289e",
       "firstName": "Kossi007"
   }
   */
   router.post(baseUrl + '/user/search/:realm', function (req, res) {
       console.log(req.body);
       var token = req.get("Authorization").split(" ").pop();
       users.find(token, req.params.realm, req.body).then(r => res.json(r));
   });
   
   //get the list of all users
   router.get(baseUrl + '/user/search/:realm', function (req, res) {
       //console.log(req.body);
       //console.log('headers: ', req.headers);
       //console.log('Authorization header: ', req.get("Authorization"));
   
       //var token = req.get("Authorization").split(" ").pop();
       var token = req.headers["Authorization"].split(" ").pop();
       users.find(token, req.params.realm).then(r => res.json(r));
   });
   
   //remove a user
   router.delete(baseUrl + '/user/delete/:realm/:userid', function (req, res) {
       //console.log(req.body);
       //console.log('headers: ', req.headers);
       //console.log('Authorization header: ', req.get("Authorization"));
   
       //var token = req.get("Authorization").split(" ").pop();req.params.userid
       var token = req.headers["Authorization"].split(" ").pop();
       users.remove(token, req.params.realm, req.params.userid).then(r => res.json(r));
   });
   
   //update a specific user information
   router.put(baseUrl + '/user/update/:realm', function (req, res) {
       var token = req.headers["Authorization"].split(" ").pop();
       users.update(token, req.params.realm, req.body).then(r => res.json(r));
   });
   
   
   //get a specific user information
   router.get(baseUrl + '/user/search/:realm/:userid', function (req, res) {
       console.log(req.body);
       var token = req.get("Authorization").split(" ").pop();
       users.find(token, req.params.realm, { userId: userid }).then(r => res.json(r));
   });
}


module.exports = {install};
