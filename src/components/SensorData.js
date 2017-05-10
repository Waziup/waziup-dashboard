
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import UTILS from '../utils.js';
import shortid from 'shortid';
class SensorData extends Component {

  getRow = (rowData) => {
    var returnValue = [];
    var meas = UTILS.getMeasurements(rowData);
    for(var i in meas){
        returnValue.push(
           <li> {meas[i].key + ": " + meas[i].value} </li>
        )
    }
    return returnValue;
  }
  render() {
      var id = shortid.generate();
    return (
      <div key={id}>
        {
          this.getRow(this.props.rowData)
        }
        </div>
    );
  }
}

export default SensorData;

