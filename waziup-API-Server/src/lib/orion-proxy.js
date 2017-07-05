"use strict";

const server = require('./server');
const app = server.app;
const { AccessLevel, servicePathProtection } = server.access;
const request = require('request');
const url = require('url');

const methodAccess = {
    GET: AccessLevel.VIEW,
    POST: AccessLevel.EDIT,
    PUT: AccessLevel.EDIT,
    DELETE: AccessLevel.EDIT
};

function getServicePathFromHeader(req) {
    if (req.headers['fiware-service'] !== 'watersense') {
        return;
    }

    return req.headers['fiware-servicepath'];
}

function proxyOrion(method, path, req, res) {
    const reqUrl = url.parse(req.url);
    const proxyUrl = `http://broker.waziup.io/v2/entities${path}${reqUrl.search || ''}`;
    console.log('proxyUrl:', proxyUrl);
    console.log('req.body:', req.body);
    console.log('method:', method);

    const options = {
        method,
        url: proxyUrl,
        headers: {
            'Fiware-Service': 'watersense',
            'Fiware-ServicePath': req.headers['fiware-servicepath']
        },
        json: true
    };

    //GET method gives error if req has a body
    if(method !== 'GET')
        options.body = req.body;

    request(options).pipe(res);
    //console.log(res);
}



function install(baseUrl) {
    for (const method in methodAccess) {
        const accessLevel = methodAccess[method];

        app[method.toLowerCase()](baseUrl, servicePathProtection(accessLevel, getServicePathFromHeader), (req, res) => {
            proxyOrion(method, '', req, res)
        });

        app[method.toLowerCase()](baseUrl + '/*', servicePathProtection(accessLevel, getServicePathFromHeader), (req, res) => {
            proxyOrion(method, '/' + req.params[0], req, res)
        });
    }
}

module.exports = {
    install
};