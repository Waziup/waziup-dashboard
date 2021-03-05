import React, {Component} from 'react';
import config from '../../../config';
import PropTypes from 'prop-types';

export default class DeviceHelp extends Component {

  constructor(props){
    super(props);
  }

  render() {
    const device = this.props.device;
    const apiUrl = config.APIServerUrl + "/v2/devices/" + device.id
    if(!this.props.show){
          return null;
      }
    return (
      <div class='help'>
        <span class="close" onClick={this.props.onClose()}>&times;</span>
        <span>
          <h1> This is your device!</h1>
          You can access this device through the API in various ways.<br/>
          More information in the <a href={config.docAPIUrl} target="_blank">API documentation</a>.
          <h5> HTTP </h5>
          <a href={apiUrl} target="_blank">{apiUrl}</a>
          <h4> cURL </h4>
          <pre> curl {apiUrl} </pre>
          <h4> Python </h4>
          <pre> <code>
            {"import requests\n resp = requests.get('" + apiUrl + "')\nprint(resp.json())"}
          </code> </pre>
          <h4> NodeJS </h4>
          <pre> <code>
            {"const axios = require('axios');\n let resp = await axios.get('" + apiUrl + "');\nconsole.log(JSON.stringify(resp.data));"}
          </code> </pre>

        </span>
      </div>
    )
  }
}
DeviceHelp.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
