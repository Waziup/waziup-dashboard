
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import UTILS from '../utils.js';
import shortid from 'shortid';

class SensorData extends Component {
  
  constructor(props) {
    super(props)
  }

  render() {

    let {griddleKey, rowData} = this.props;
    var id = shortid.generate();
    return (
      <div key={id}>
        {
          this.getSensorData(rowData)
        }
        </div>
    );
  }
}

export default SensorData;

