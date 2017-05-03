import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import UTIL from '../../../../utils'
class SensorChart extends Component {
  constructor(props){
    super(props); 
  }
  componentWillReceiveProps(nextProps){
    var measurements = [];
    if(!UTIL.objIsEmpty(nextProps.sensor)){
      measurements =  UTIL.getMeasurements(nextProps.sensor);
      console.log(measurements)
      // this.props.getHistoData(nextProps.sensor,measurements[0].key)
    } 
  }
  render() {
    return (
        <div>
        </div>
    );
  }
}

export default SensorChart;
