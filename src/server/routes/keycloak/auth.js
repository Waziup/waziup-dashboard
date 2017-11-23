const requestToken = require('keycloak-request-token');

function getToken(baseUrl, settings) {
    if (settings.accessToken) {
        return Promise.resolve(settings.accessToken);
    }
    return requestToken(baseUrl, settings);
}

function authenticate(settings) {
    return getToken(settings.baseUrl, settings)
        .then((token) => {
            return token;
        });
}

module.exports = authenticate;