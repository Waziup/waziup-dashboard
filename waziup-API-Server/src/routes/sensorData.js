"use strict";

const Promise = require('bluebird');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
const elasticsearch = require('elasticsearch');
const safeHandler = require('../lib/handlers');
const server = require('../lib/server');

const { AccessLevel, keycloak, servicePathProtection, getServicePathFromHeader } = server.access;

const es = new elasticsearch.Client({
    host: config.get('elasticsearch.host') + ':' + config.get('elasticsearch.port')
    // , log: 'trace'
});

async function searchFarmData(req, res) {
    const msearch = [];

    for (let sensorAttrib of ['SM1', 'SM2']) {
        msearch.push({
            index: req.params.farmid
        });

        msearch.push({
            from: 0,
            size: 0,
            query: {
                bool: {
                    must: [
                        {
                            term: {
                                attribute: sensorAttrib
                            }
                        },
                        {
                            range: {
                                time: { gte: new Date().getTime() - 1000 * 60 * 60 * 24 * 7 }
                            }
                        }
                    ]
                }
            },
            aggs: {
                buckets: {
                    date_histogram: {
                        field: 'time',
                        interval: '6h',
                        time_zone: config.get('timezone')
                    },
                    aggs: {
                        value_avg: {
                            avg: {
                                field: 'value'
                            }
                        }
                    }
                }
            },

            sort: {time: 'asc'}
        });
    }

    const searchResults = await es.msearch({
        body: msearch
    });

    const dataMap={};

    function addAggregations(index, fieldName) {
        for (let agg of searchResults.responses[index].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry[fieldName] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }
    }

    addAggregations(0, 'sm1');
    addAggregations(1, 'sm2');

    const dataKeys = Object.keys(dataMap);
    dataKeys.sort();

    const dataArray = [];
    for (let key of dataKeys) {
        dataArray.push(dataMap[key]);
    }

    res.json(dataArray);
}

async function searchSensorData(req, res) {
    const msearch = [];
    const sensorid = req.params.sensorid;
    const index = req.params.farmid;
    //console.log('sensorid:', sensorid);
    //console.log('index:', index);

    msearch.push({
        index: index
    });

    msearch.push({
        from: 0,
        size: 1000,
        query: {
            bool: {
                must: [
                    {
                        term: {
                            name: sensorid
                        }
                    }
                ]
            }
        },
        sort: { time: 'asc' }
    });

    const searchResults = await es.msearch({body: msearch});

    //console.log('searchResults', searchResults);
    let dataMap = {};

    if(!!searchResults.responses && Object.values(searchResults.responses).length !== 0) {
        const hits = searchResults.responses[0].hits;
        //console.log('hits', hits);

        dataMap = hits.hits.reduce((prev, curr) => {
            const entry = curr._source;
            prev[entry.attribute] = prev[entry.attribute] || [];
            prev[entry.attribute] = prev[entry.attribute].concat({'t': entry.time, 'v':entry.value});
            return prev;
        }, {});
    }

    res.json(dataMap);
}

const routerSearch = express.Router();
//sensor data analysis: sensor provider
routerSearch.get('/search/:farmid', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader), safeHandler(searchFarmData));
routerSearch.get('/search/:farmid/:sensorid', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader), safeHandler(searchSensorData));

//single sensor values: /FARM1/Sensor1 SM1, SM2
//get this data from refer to docs: elasticsearch javascript API restrict the search limit
//find the use case:

module.exports = routerSearch;