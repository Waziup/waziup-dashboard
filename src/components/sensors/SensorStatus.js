import React, { Component } from 'react';
import UTILS from '../../lib/utils.js';
import shortid from 'shortid';
import moment from 'moment-timezone';
import { green900, red900 } from 'material-ui/styles/colors';

class SensorStatus extends Component {

  render() {
    let { rowData } = this.props;
    let now = moment();
    const dateModified = rowData.dateModified;
    const minutes = now.diff(dateModified, 'minutes')
    return (
      <div>
        {(minutes > 120) ? <p style={{ color: red900 }}><b>INACTIVE</b></p> :
          <p style={{ color: green900 }}><b>ACTIVE</b></p>}
      </div>
    );
  }
}

export default SensorStatus;
