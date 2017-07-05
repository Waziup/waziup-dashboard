const express = require('express');
const server = require('../lib/server');

const { AccessLevel, keycloak, servicePathProtection, extractPermissions } = server.access;

const routerAuthz = express.Router();
var cors = require('cors')
//routerAuthz.options('/permissions', cors());
routerAuthz.get('/permissions', keycloak.protect, function (req, res) {
    //console.log(req.headers, res.headers);
/*    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", 0);*/
    res.json({
        permissions: extractPermissions(req)
    });
});

routerAuthz.get('/test1', servicePathProtection(AccessLevel.VIEW, req => req.query.sp), (req, res) => {
    res.json({
        result: 'OK'
    });
});

module.exports = routerAuthz;