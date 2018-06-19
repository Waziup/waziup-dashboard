
module.exports = {
  // Node.js app
  serverPort: process.env.SERVER_PORT || 3000,
  keycloakUrl: process.env.KEYCLOAK_URL || 'http://localhost:8080/auth',
  realm: 'waziup',
  clientId: 'dashboard',
  APIServerUrl: process.env.API_SERVER_URL || 'http://localhost/api',
  logLevel: process.env.LOG_LEVEL || 'INFO',  
  // Web analytics
  analytics: {
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },
  delaySensorNodeNew: 24 * 60 * 60 * 1000, // 24 hours (in milliseconds)
  delaySensorInactive: 12 * 60 * 60 * 1000, // 12 hours (in milliseconds)
  delayRefresh: 10*1000 // 10 seconds
};
