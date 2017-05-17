import axios from 'axios'

export const HISTORICAL_DATA_REQUEST = 'HISTORICAL_DATA_REQUEST'
export const HISTORICAL_DATA_REQUEST_ERROR = 'HISTORICAL_DATA_REQUEST_ERROR'
export const HISTORICAL_DATA_FETCHED = 'HISTORICAL_DATA_FETCHED'

export const historicalDataRequest = (deviceId, sensorId) => ({
  type: HISTORICAL_DATA_REQUEST,
  deviceId: deviceId,
  sensorId: sensorId,
  lastUpdated: Date.now()
})

export const historicalDataRequestError = (deviceId, sensorId, errMsg) => ({
  type: HISTORICAL_DATA_REQUEST_ERROR,
  deviceId: deviceId,
  sensorId: sensorId,
  errMsg: errMsg
})

export const historicalDataFetched = (deviceId, sensorId, data) => ({
  type: HISTORICAL_DATA_FETCHED,
  deviceId: deviceId,
  sensorId: sensorId,
  data: data,
  lastUpdated: Date.now()
})

const fetchHistoricalDataSensor = (deviceId, sensorId, sp) => (dispatch, getState) => {
  dispatch(historicalDataRequest(deviceId, sensorId))
  //const servicePath = getState().security.userInfo.idTokenParsed.ServicePath
  const service = getState().security.userInfo.idTokenParsed.Service
  //console.log(servicePath, service, sp)

  let url = 'http://historicaldata.waziup.io/STH/v1/contextEntities/type/SensingDevice/id/' +
    deviceId + '/attributes/' + sensorId;

  axios.get(url, {
    params: { 'lastN': '24' },
    headers: {
      'Fiware-ServicePath': sp,
      'Fiware-Service': service,
      "Accept": "application/json"
    }
  }).then((response) => {
    const contextResponse0 = response.data.contextResponses[0];
    const { contextElement: contextElement } = contextResponse0;
    const attribute0 = contextElement.attributes[0];
    const values = attribute0.values;
    const data = [];
    for (var i in values) {
      const value = values[i]
      data.push({ time: value.recvTime.toString().substring(11, 19), value: parseFloat(value.attrValue) })
    }
    dispatch(historicalDataFetched(deviceId, sensorId, data))
  }).catch((response) => {
    dispatch(historicalDataRequestError(deviceId, sensorId, response))
  })
}

export const fetchHistoricalData = (deviceId, sensorIds, sp) => (dispatch, getState) => {
  sensorIds.map((sensorId) => {
    dispatch(fetchHistoricalDataSensor(deviceId, sensorId, sp))
  })
}