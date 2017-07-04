"use strict";

const Promise = require('bluebird');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const server = require('./lib/server');
//importing individual routes
const sensorDataRoute = require('./routes/sensorData');
const authzRoute = require('./routes/authorization');

const app = server.app;

var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "localhost:4000");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie");
//   next();
// });

//FIXME 
const router = express.Router();
//
//router.all('*', cors({origin: true, credentials: true}));

//FIXME 
router.use(function(req, res, next) {
  console.log('%s %s %s', req.method, req.url, req.path);
  next();
});

app.use(express.static("../../client/build"));

//app.disable('etag');
app.use('/api/v1', router);
//  .../search/:farmid
router.use('/sensorData', sensorDataRoute);
//  .../permissions .../test
router.use('/authorization', authzRoute);
//router.options('/api/v1/authorization/permissions', cors())

async function run() {
    await new Promise(resolve => app.listen(4000, () => resolve()));
    console.log('Listening on port 4000');
}

run();