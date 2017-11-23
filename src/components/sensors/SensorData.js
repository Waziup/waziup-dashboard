import React, {Component} from 'react';
import UTILS from '../../lib/utils.js';
import shortid from 'shortid';

class SensorData extends Component {

  render() {
    let {rowData} = this.props;
    var id = shortid.generate();
    return (
      <div key={id}>
        { UTILS.getSensorData(rowData) }
      </div>
    );
  }
}

export default SensorData;

