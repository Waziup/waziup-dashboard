
module.exports = {
  // Node.js app
  serverPort: process.env.SERVER_PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL || `http://localhost:${process.env.SERVER_PORT || 3000}`,
  },

  // Web analytics
  analytics: {
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  keycloakUrl: 'http://localhost:8080/auth',
  realm: 'waziup',
  clientId: 'dashboard',
  orionUrl: process.env.ORION_URL   || process.env.REACT_APP_ORION_API || 'http://broker.waziup.io:80',
  elasticsearchUrl: process.env.ELASTICSEARCH_URL    || 'http://elasticsearch.waziup.io',
  APIServerUrl: process.env.REACT_APP_APISERVER_URL || 'http://localhost/api'
};
