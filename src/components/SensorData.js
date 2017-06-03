
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import UTILS from '../utils.js';
import shortid from 'shortid';

class SensorData extends Component {
  
  constructor(props) {
    super(props)
  }

  getSensorData = (sensor) => {
    var returnValue = [];
    var meas = UTILS.getMeasurements(sensor);
    for(var i in meas){
        returnValue.push(
           <li> {meas[i].key + ": " + meas[i].value} </li>
        )
    }
    return returnValue;
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

