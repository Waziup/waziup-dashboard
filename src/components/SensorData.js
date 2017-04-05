
import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';

class SensorData extends Component {
  getRow = ()=>{
    var returnValue = [];
    for(var i in this.props.rowData){
      if (i!=='id'&&i!='type'&&i!='owner'&&i!='last_value'&&i!="actions") {
        let val = (this.props.rowData[i] && typeof this.props.rowData[i] != 'undefined' )? this.props.rowData[i] : 0;
        returnValue.push(
           <li> {i + " : " + String(val)} </li>
          )
        }
      }
    return returnValue;
  }
  render() {
    return (
      <div>
        {
          this.getRow()
        }
        </div>
    );
  }
}

export default SensorData;

