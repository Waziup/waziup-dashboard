import React, {Component} from 'react';
import config from '../../../config';
import PropTypes from 'prop-types';
import apiImage from '../../../images/API.png';

export default class DeviceHelp extends Component {

  constructor(props){
    super(props);
    this.state = { 
      show: false
    }
  }

  render() {
    const device = this.props.device;
    const apiUrl = config.APIServerUrl + "/v2/devices/" + device.id
    return (
      <div style={{"margin-left":"auto"}}>
        <img src={apiImage} height="50" onClick={() => this.setState({show: true})}/>
        {this.state.show ?
          <div className='help'>
            <span className="close" onClick={() => this.setState({show: false})}>&times;</span>
            <span>
              <h1> This is your device!</h1>
              It's ID is <b>{device.id}</b>.
              The WaziGate will push informations on this device automatically, provided that the device on the gateway has the <b>same ID</b>.<br/>
              You can access this device through the API in various ways.<br/>
              More information in the <a href={config.docAPIUrl} target="_blank">API documentation</a>.
              <h2> How to retrieve this device in your application? </h2>
              <h3> HTTP </h3>
              <pre><code>
                <a href={apiUrl} target="_blank">{apiUrl}</a>
              </code></pre>
              <h3> Command line </h3>
              <pre><code>
                curl {apiUrl}
              </code></pre>
              <h3> Python </h3>
              <pre><code>
                import requests <br/>
                resp = requests.get("\"" + {apiUrl} + "\"") <br/>
                print(resp.json())
              </code> </pre>
              <h3> NodeJS </h3>
              <pre><code>
                const axios = require('axios'); <br/>
                let resp = await axios.get("\"" + {apiUrl} + "\""); <br/>
                console.log(JSON.stringify(resp.data));
              </code> </pre>
            </span>
          </div>
        :null}
      </div>
    )
  }
}

DeviceHelp.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  device: PropTypes.object
};
