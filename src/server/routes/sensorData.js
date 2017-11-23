"use strict";

const Promise = require('bluebird');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('../../config.js');
const elasticsearch = require('elasticsearch');
const safeHandler = require('../lib/handlers');
const access = require('../lib/access.js');

const { AccessLevel, keycloak, servicePathProtection, getServicePathFromHeader } = access;

const es = new elasticsearch.Client({
    host: config.elasticsearchUrl
  //  , log: 'trace'
});

//TO BE INTEGRATED when we go with new visualization frontend
async function searchSensorData(req, res) {
    const msearch = [];
    const sensorid = req.params.sensorid;
    const attributes = req.headers.attributes.split(',');
    const days = 365;

    for (let sensorAttrib of attributes) {
        msearch.push({
            index: req.params.index
        });

        msearch.push({
            from: 0,
            size: 1000,
            explain: false,
            query: {
                bool: {
                    must: [
                        {
                            match: {
                                name: sensorid
                            },
                        },
                        {
                            match: {
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
            sort: { time: 'asc' }
        });
    }

    const searchResults = await es.msearch({
        body: msearch
    });

    const dataMap = {};

    //console.log('searchResults.responses[0]', searchResults.responses[0].hits.hits);
    //TODO check if index number and attribute are right
    let index = 0;
    for (let sensorAttrib of attributes) {
        dataMap[sensorAttrib] = [];
        for (let hit of searchResults.responses[index].hits.hits) {
            const entry = { time: hit._source.time, value: hit._source.value };
            dataMap[sensorAttrib].push(entry);
        }
        index++;
    }
    console.log('dataMap:', JSON.stringify(dataMap));
    res.json(dataMap);
}

async function searchSensorData2(req, res) {
    const msearch = [];
    const sensorid = req.params.sensorid;
    const index = req.params.index;
    const attributes = req.headers.attributes.split(',');
    const days = 365;

    for (let sensorAttrib of attributes) {
        //console.log('sensorAttrib: ', sensorAttrib);
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
                            match: {name: sensorid}
                        },
                        {
                            match: {
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
                        interval: '6h'
                        //        time_zone: config.timezone
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
            sort: { time: 'asc' }
        });
    }

    const searchResults = await es.msearch({
        body: msearch
    });

    const dataMap = {};

    //console.log('searchResults', searchResults);
    //console.log('searchResults.responses[0]', searchResults.responses[0]);
    //console.log('searchResults', searchResults.responses[0].aggregations.buckets.buckets);

    //TODO check if index number and attribute are right
    let idx = 0;
    for (let sensorAttrib of attributes) {
        //console.log(searchResults.responses[index].aggregations.buckets.buckets);
        for (let agg of searchResults.responses[idx].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry[sensorAttrib] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }
        idx++;
    }

    const dataKeys = Object.keys(dataMap);
    dataKeys.sort();

    const dataArray = [];
    for (let key of dataKeys) {
        dataArray.push(dataMap[key]);
    }

    res.json(dataArray);
}

async function searchFarmData(req, res) {
    const msearch = [];
    const days = 356;
    const index = req.params.index;
    for (let sensorAttrib of ['SM1', 'SM2']) {
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
                            match: {
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
                        interval: '6h'
                        //                        time_zone: config.get('timezone')
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
            sort: { time: 'asc' }
        });
    }

    const searchResults = await es.msearch({
        body: msearch});

   // , function (error, response) {
        //console.log('response', JSON.stringify(response));
     //   if (!!error)
       //     console.log('error', JSON.stringify(error));
        //res.json(response);
    //}
    const dataMap = {};

    function addAggregations(idx, fieldName) {
        for (let agg of searchResults.responses[idx].aggregations.buckets.buckets) {
            const entry = dataMap[agg.key] || { t: agg.key };
            entry[fieldName] = agg.value_avg.value;
            dataMap[agg.key] = entry;
        }
    }

    //console.log(searchResults.responses);
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

async function searchFarmEvent0(req, res) {
    const msearch = [];
    //const farmName = req.params.farmName;

    //assuming in this index (each service path), there is only one farm, then this works,
    //otherwise we need to search for sensor name as well
    msearch.push({
        index: req.params.index,
        type: 'sensingObject'
    });

    /*
    Use query clauses in query context for conditions which should affect the score of matching documents (i.e. how well does the document match), and use all other query clauses in filter context.
    */
    msearch.push({
        from: 0,
        size: 20,
        query: {
            bool: {
                must: [
                    {
                        term: {
                            attribute: 'farmingAction'
                        }
                    }
                ]
            }
        },
        sort: { time: 'desc' }
    });

    const searchResults = await es.msearch({
        body: msearch
    });

    const dataHits = searchResults.responses[0];
    //console.log('dataHits', JSON.stringify(dataHits));

    let dataArray = [];

    for (let hit of dataHits) {
        if (!!hit._source.object) {
            const entry = { t: hit._source.attribute_timestamp, value: hit._source.object, id: hit._id };
            dataArray.push(entry);
        }
    }
    res.json(dataArray);
}

async function searchFarmEvent(req, res) {
    let count = 10;
    const index = req.params.index;
    await es.count({
        index: index,
        type: 'sensingObject',
        body: {
            query: {
                match: {
                    attribute: 'farmingAction'
                }
            }
        }
    }, function (err, response) {
        count = response.count;
        //console.log('count', JSON.stringify(response));
        //res.json(count);
    });

    const msearch = [];
    //assuming in this index (each service path), there is only one farm, then this works,
    //otherwise we need to search for sensor name as well
    msearch.push({
        index: index,
        type: 'sensingObject'
    });

    /*
    Use query clauses in query context for conditions which should affect the score of matching documents (i.e. how well does the document match), and use all other query clauses in filter context.
    */
    msearch.push({
        from: 0,
        size: count,
        query: {
            match: {
                attribute: 'farmingAction'
            }
        },
        sort: { time: 'desc' }
    });

    const searchResults = await es.msearch({
        body: msearch
    });

    //console.log('searchResults.responses[0]', searchResults.responses[0]);
    const dataHits = searchResults.responses[0].hits.hits;
    //console.log('dataHits', JSON.stringify(dataHits));

    let dataArray = [];

    for (let hit of dataHits) {
        if (!!hit._source.object) {
            const entry = { t: hit._source.attribute_timestamp, value: hit._source.object, id: hit._id };
            dataArray.push(entry);
        }
    }
    res.json(dataArray);
}

async function deleteFarmEventAll(req, res) {
    const index = req.params.index;
    const id = req.params.id;

    const result = await es.deleteByQuery({
        index: index,
        body: {
            query: {
                term: {
                    attribute: 'farmingAction'
                }
            }
        }
    }, function (error, response) {
        //console.log('response', JSON.stringify(response));
        if (!!error)
            console.log('error', JSON.stringify(error));
        res.json(response);
    });

    //console.log('result', JSON.stringify(result));
}

async function deleteFarmEvent(req, res) {
    const index = req.params.index;
    const id = req.params.id;

    const result = await es.delete({
        index: index,
        type: 'sensingObject',
        id: id,
        refresh: true
    }, function (error, response) {
        //console.log('response', JSON.stringify(response));
        if (!!error)
            console.log('error', JSON.stringify(error));
        res.json(response);
    });

    //console.log('deleteFarmEvent result', JSON.stringify(result));
}


function install(router, baseUrl, keycloak) {
    //sensor data analysis: sensor provider
    router.get(baseUrl + '/search/:index', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader, keycloak),
        safeHandler(searchFarmData));
    router.get(baseUrl + '/search/:index/:sensorid', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader, keycloak),
        safeHandler(searchSensorData));
    router.get(baseUrl + '/farmevents/:index', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader, keycloak),
        safeHandler(searchFarmEvent));
    router.delete(baseUrl + '/farmevents/:index/:id', servicePathProtection(AccessLevel.VIEW, getServicePathFromHeader, keycloak),
        safeHandler(deleteFarmEvent));
}



module.exports = {
    install
};
