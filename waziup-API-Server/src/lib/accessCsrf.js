"use strict";

const Keycloak = require('keycloak-connect');
const csrf = require('csurf');

const AccessLevel = {
    VIEW: 0,
    EDIT: 1
};

const csrfProtection = csrf();

/*
  Does CSRF protection in case a user is authorized from a session. If she is authorized from the authorization header,
  the CSRF protection is avoided.
 */
function csrfOrBearerProtection(req, res, next) {
     if (req.session['keycloak-token']) {
        // If there is a possibility that keycloak use a token from the session, then we enforce CSRF protection
        csrfProtection(req, res, next);
    } else {
        next();
    }
}


function setup(app, sessionStore) {

    const keycloak = new Keycloak({ store: sessionStore });

    /*
     This extracts the "permissions" field from the access token and transforms it in the following way:

     "admin ; advisor : /FARM1;advisor:/FARM2 ; farmer : /FARM2"

     =>

     {
     admin: [],
     advisor: [ '/FARM1', '/FARM2' ],
     farmer: [ '/FARM2' ]
     }
     */
    function extractPermissions(req) {
        const permString = req.kauth.grant.access_token.content.permissions;
        const permissions = {};
        
        if(permString === undefined)
            return permissions;
        const permPairs = permString.split(/\s*;\s*/).map(permPair => permPair.split(/\s*:\s*/));

        for (const permPair of permPairs) {
            const key = permPair[0];
            const value = permPair[1];

            if (!(key in permissions)) {
                permissions[key] = [];
            }

            if (value !== undefined) {
                permissions[key].push(value);
            }
        }

        return permissions;
    }

    function _servicePathIncluded(permission, servicePath) {
        return permission && permission.some(sp => servicePath === sp || servicePath.startsWith(sp + '/'));
    }

    /*
     Allows access to a handler only if the user has permission admin or advisor/farmer with a service path
     which equals is is a parent to the requested service path.

     Parameter "getServicePath" is a function (request => servicePath) that extracts the service path from the request.
     */
    function servicePathProtection(accessLevel, getServicePath) {
        return keycloak.protect((token, req) => {
            const permissions = extractPermissions(req);
            const servicePath = getServicePath(req);

            const result =
                servicePath && (

                    !!permissions['admin'] ||

                    (accessLevel === AccessLevel.EDIT &&
                    _servicePathIncluded(permissions['advisor'], servicePath)) ||

                    (accessLevel === AccessLevel.VIEW && (
                        _servicePathIncluded(permissions['advisor'], servicePath) ||
                        _servicePathIncluded(permissions['farmer'], servicePath)
                    ))
                )
            ;

            return result;
        });
    }

    /*
      Combines the CSRF protection (if user is authorized based on a session) with protectByServicePath
     */
    function csrfAndServicePathProtection(accessLevel, getServicePath) {
        const auth = servicePathProtection(accessLevel, getServicePath);

        return (req, res, next) => {
            csrfOrBearerProtection(req, res, (err) => {
                if (err) {
                    next(err);
                } else {
                    auth(req, res, next);
                }
            });
        };
    }

    /*
     Combines the CSRF protection with the requirement that the user is authenticated
     */
    function csrfAndAuthProtection(req, res, next) {
        const auth = keycloak.protect();

        csrfProtection(req, res, (err) => {
            if (err) {
                next(err);
            } else {
                auth(req, res, next);
            }
        });
    }


    app.use(keycloak.middleware({
        logout: '/logout',
        admin: '/'
    }));

    return {
        AccessLevel,
        keycloak,
        extractPermissions,
        servicePathProtection,
        csrfProtection,
        csrfOrBearerProtection,
        csrfAndServicePathProtection,
        csrfAndAuthProtection
    }
}

module.exports = setup;