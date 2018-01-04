
module.exports = {
  // Node.js app
  port: process.env.PORT || 3000,

  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl:
      process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  },

  // Web analytics
  analytics: {
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

  keycloakUrl: 'http://aam.waziup.io/auth',
  realm: 'waziup',
  clientId: 'dashboard',
  orionUrl: 'http://broker.waziup.io:80',
  elasticsearchUrl: 'http://elasticsearch.waziup.io'
};
