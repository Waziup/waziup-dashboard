
module.exports = {
  // Node.js app
  serverPort: process.env.SERVER_PORT || 3000,
  keycloakUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
  realm: 'waziup',
  clientId: 'dashboard',
  APIServerUrl: process.env.REACT_APP_APISERVER_URL || 'http://localhost/api',
  
  // Web analytics
  analytics: {
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  }
};
