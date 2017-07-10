"use strict";

const Promise = require('bluebird');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../lib/config.js');
const defaultConfig = require('config');
const elasticsearch = require('elasticsearch');
const safeHandler = require('../lib/handlers');
const server = require('../lib/server');

const { AccessLevel, keycloak, servicePathProtection, getServicePathFromHeader } = server.access;

const esConfig = config.mergeWith(defaultConfig.elasticsearch, 'elasticsearch');

const es = new elasticsearch.Client({
    host: esConfig.host + ':' + esConfig.port
    // , log: 'trace'
});

async function searchSensorData(req, res) {
    const msearch = [];
    const sensorid = req.params.sensorid;
    const attributes = req.headers.attributes.split(',');
    const days = 365;
    
    //console.log('attributes: ', attributes);

    for (let sensorAttrib of attributes) {
        //console.log('sensorAttrib: ', sensorAttrib);

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
                                name: sensorid
                            }, 
                        },
                        {
                            term: {
                                attribute: sensorAttrib
                            }
                        },
                        {
                            range: {
                                time: { gte: new Date().getTime() - 1000 * 60 * 60 * 24 * days }
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

    //console.log('searchResults', searchResults);
    //console.log('searchResults.responses[0]', searchResults.responses[0]);
    //console.log('searchResults', searchResults.responses[0].aggregations.buckets.buckets);

    let index = 0;
    for (let sensorAttrib of attributes) {
        //console.log(searchResults.responses[index].aggregations.buckets.buckets);
        for (let agg of searchResults.responses[index].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry[sensorAttrib] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }
        index++;
    }

    const dataKeys = Object.keys(dataMap);
    dataKeys.sort();

    const dataArray = [];
    for (let key of dataKeys) {
        dataArray.push(dataMap[key]);
    }

    //console.log('dataArray: ', dataArray);
    res.json(dataArray);
}

async function searchFarmData(req, res) {
    const msearch = [];
    const days = 356;
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
                                time: { gte: new Date().getTime() - 1000 * 60 * 60 * 24 * days }
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
        //console.log(searchResults.responses[index].aggregations.buckets.buckets);
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

//FIXME
async function searchSensorDataOld(req, res) {
    const msearch = [];
    const sensorid = req.params.sensorid;
    const index = req.params.farmid;
    const days = 356;
    //console.log('sensorid:', sensorid);
    //console.log('index:', index);

    msearch.push({
        index: index
    });

    msearch.push({
        from: 0,
        size: 0,
        query: {
            bool: {
                must: [
                    {
                        term: {
                            name: sensorid
                        }, 
                    },
                    {   term : {
                            attribute: 'SM1'
                        }
                    },
                    {
                        range: {
                            time: { gte: new Date().getTime() - 1000 * 60 * 60 * 24 * days }
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
            },
        },
        sort: { time: 'asc' }
    });

    const searchResults = await es.msearch({body: msearch});
    //console.log('searchResults', searchResults);
    let dataMap = {};
    /*
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
    }*/
    //dataMap = {t:, v:}
    if(!!searchResults.responses && Object.values(searchResults.responses).length !== 0) {
        //console.log('buckets:', searchResults.responses[0].aggregations.buckets.buckets);
        /*for (let agg of searchResults.responses[0].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry['fieldName'] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }*/

        /*for (let agg of searchResults.responses[0].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry[fieldName] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }
        //curr._source .attribute .time . value
        dataMap = hits.hits.reduce((prev, curr) => {
            const entry = curr._source;
            console.log('_source', entry);
            prev[entry.attribute] = prev[entry.attribute] || [];
            prev[entry.attribute] = prev[entry.attribute].concat({'t': entry.time, 'v':entry.value});
            return prev;
        }, {});*/
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