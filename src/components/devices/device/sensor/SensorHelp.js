import React, {Component} from 'react';
import config from '../../../../config';
import PropTypes from 'prop-types';
import apiImage from '../../../../images/API.png';

export default class SensorHelp extends Component {

  constructor(props){
    super(props);
    this.state = { 
      show: false
    }
  }

  render() {
    const device = this.props.device;
    const sensor = this.props.sensor;
    const apiUrl = config.APIServerUrl + "/v2/devices/" + device.id + "/sensors/" + sensor.id
    const mqttUrl = "mqtt://api.waziup.io/devices/" + device.id + "/sensors/" + sensor.id + "/value"

    return (
      <div style={{"margin-left":"auto"}}>
      <img src={apiImage} height="50" onClick={() => this.setState({show: true})}/>
      {this.state.show ?
        <div class='help'>
          <span className="close" onClick={() => this.setState({show: false})}>&times;</span>
          <span>
            <h1> This is your sensor!</h1>
            
            It's ID is <b>{sensor.id}</b>, it is plugged on top of device <b>{device.id}</b>.
            The WaziGate will push informations on this sensor automatically, provided that the device and the sensor on the gateway have the <b>same ID</b>.<br/>
            You can access this sensor through the API in various ways.<br/>
            More information in the <a href={config.docAPIUrl} target="_blank">API documentation</a>.
            <h2> How to <b>push data</b> to this sensor? </h2>
            Independently of any gateway, you can push data to this sensor.

            <h3> Arduino LoRa/LoRaWAN</h3>
            For sending data on LoRa/LoRaWAN, you need a LoRaWAN gateway (such as WaziGate). <br/>
            You need to create and configure your devices in the gateway; they will be created here automatically. <br/>
            <a href={config.docUrl + "/wazigate"} target="_blank">How to install and configure your gateway.</a> <br/>
            <a href={config.docUrl + "/wazidev"} target="_blank">How to install and configure your devices.</a>

            <h3> Arduino Wifi</h3>
            If your Arduino board has Wifi (or any other HTTP capable network), you can send data directly to WaziCloud:
            <pre><code>
              #include &lt;ArduinoHttpClient.h&gt;<br/>
              HttpClient httpClient = HttpClient(client, "api.waziup.io", 80);<br/>
              httpClient.post("/api/v2/devices/{device.id}/sensors/{sensor.id}/value", "text/plain;charset=utf-8", 25);
            </code></pre>
            <a href={config.docUrl + "/wazidev/other_boards/"} target="_blank">More infos and examples</a>.

            <h3> Command line </h3>
            <pre><code>
              curl -X POST {apiUrl} -H  "Content-Type: text/plain;charset=utf-8" -d "25" -v
            </code></pre>
            <h3> Python </h3>
            <pre><code>
              import requests <br/>
              resp = requests.get({apiUrl}) <br/>
              print(resp.json())
            </code> </pre>
            <h3> NodeJS </h3>
            <pre><code>
              const axios = require('axios'); <br/>
              let resp = await axios.get({apiUrl}); <br/>
              console.log(JSON.stringify(resp.data));
            </code> </pre>

            <h2> How to <b>get data</b> from this sensor? </h2>
            Your application can retrieve data in various ways:
            <h3> HTTP </h3>
            You can simply open this link in your browser to get the sensor's details:
            <pre><code>
              <a href={apiUrl} target="_blank">{apiUrl}</a>
            </code></pre>
            To get more values from the sensor, add "/values" at the end:
            <pre><code>
              <a href={apiUrl + "/values"} target="_blank">{apiUrl}/values</a>
            </code></pre>
            Several query strings can be added, such as <code>?limit=100</code>. See the <a href={config.docAPIUrl + "#read-sensor-values"} target="_blank">documentation</a> for more.
            <h3> MQTT </h3>
            You can subscribe on this sensor this way:
            <pre><code>
              mosquitto_sub -L "mqtt://api.waziup.io/devices/MyDevice/sensors/TC1/value"
            </code></pre>
            <h3> Command line </h3>
            <pre><code>
              curl {apiUrl}
            </code></pre>
            <h3> Python </h3>
            <pre><code>
              import requests <br/>
              resp = requests.get({apiUrl}) <br/>
              print(resp.json())
            </code> </pre>
            <h3> NodeJS </h3>
            <pre><code>
              const axios = require('axios'); <br/>
              let resp = await axios.get({apiUrl}); <br/>
              console.log(JSON.stringify(resp.data));
            </code> </pre>
          </span>
        </div>
      :null}
    </div>
    )
  }
}

SensorHelp.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  sensor: PropTypes.object,
  device: PropTypes.object
};
