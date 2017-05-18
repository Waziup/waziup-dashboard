
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import UTILS from '../utils.js'

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
    return (
      <div>
        {
          this.getRow(this.props.rowData)
        }
        </div>
    );
  }
}

export default SensorData;

