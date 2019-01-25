import path from 'path';
import express from 'express';
import request from 'request';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import cors from 'cors';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';

// Create app and router
const app = express();

// Include cors headers responses
app.use(cors());

// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the user agent is not known.
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

// Serve public folder
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('*', async (req, res, next) => {
  try {
    const data = { vendor: assets.vendor.js, client: assets.client.js };
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
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]}
      title="Internal Server Error"
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

// Launch the server
if (!module.hot) {
  app.listen(config.serverPort, () => {
    console.info(`The server is running at http://localhost:${config.serverPort}/`);
  });
}

// Hot Module Replacement
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./server');
}

export default app;
