import path from 'path';
import express from 'express';
import request from 'request';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
const orionProxy = require('./server/lib/orion-proxy');
const sensorDataRoute = require('./server/routes/sensorData');
const kcProxy = require('./server/routes/keycloak/keycloak-admin');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const cors = require('cors');

//Create app and router
const app = express();
const router = express.Router();

//use body parser (to decode the body in the request)
app.use(bodyParser.json());
//Include cors headers responses 
app.use(cors());

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Serve public folder 
app.use(express.static(path.resolve(__dirname, 'public')));

//Create memory store and session to store user credentials server side
var memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));


//Add keycloak middleware to handle request authentication
const keycloak = new Keycloak({
      url: config.keycloakUrl,
      realm: config.realm,
      clientId: config.clientId,
      publicClient : true,
      store: memoryStore
    });

app.use(keycloak.middleware({
        logout: '/logout',
        admin: '/'
    }));


// Install route handlers
sensorDataRoute.install(router, '/sensorData', keycloak);
orionProxy     .install(router, '/orion',      keycloak);
kcProxy        .install(router, '/kcadmin',    keycloak);
app.use('/api/v1', router);

// Register server-side rendering
// keycloak protect will redirect to login page if the user is not logged in 
app.get('*', keycloak.protect(), async (req, res, next) => {
  try {
    const css = new Set();

    const data = { };
    data.title = 'WAZIUP';
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js, assets.client.js, 'http://dev.waziup.io:8080/auth/js/keycloak.js'];
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});


// Error handling
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => {
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

// Launch the server
if (!module.hot) {
  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
}

// Hot Module Replacement
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./server');
}

export default app;
