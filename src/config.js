
module.exports = {
  //In a production environment, those environment variables will be overitten at startup by webpack (see webpack.config.js). 
  serverUrl: process.env.SERVER_URL || `http://localhost:${process.env.SERVER_PORT || 3000}`,
  serverPort: process.env.SERVER_PORT || 3000,
  keycloakUrl: process.env.KEYCLOAK_URL || 'https://keycloak.waziup.io/auth',
  realm: 'waziup',
  clientId: 'dashboard',
  APIServerUrl: process.env.API_SERVER_URL || 'https://api.waziup.io/api',
  logLevel: process.env.LOG_LEVEL || 'INFO',  
  // Web analytics
  analytics: {
    googleTrackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },
  delayDeviceNew: 24 * 60 * 60 * 1000, // 24 hours (in milliseconds)
  delayDeviceActive: 12 * 60 * 60 * 1000, // 12 hours (in milliseconds)
  delayRefresh: 10*1000 // 10 seconds
};
