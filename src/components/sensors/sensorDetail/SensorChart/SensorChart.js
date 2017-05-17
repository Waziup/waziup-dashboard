import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import UTIL from '../../../../utils'
import { getHisto } from "../../../../index.js"

class SensorChart extends Component {
  constructor(props){
    super(props);
  }
  defaultProps = {
    sensor: {}
  };

  componentWillReceiveProps(nextProps){
    
    if(!UTIL.objIsEmpty(nextProps.sensor) && (nextProps.sensor !== this.props.sensor)){
      getHisto(nextProps.sensor);
    }
  }

  render() {
    let {width,height} = this.props;
    var visCompAll = [];
    for (var measurementId in this.props.historical) {
        //const data = this.state.historicalData[measurementId];
      const unit = this.props.sensor[measurementId]["metadata"]["unit"]? this.props.sensor[measurementId]["metadata"]["unit"]["value"]: "";
      //const unit = 'cm';
      const YAxisLabel = measurementId + '(' + unit + ')';
      var visComp = [<CardText> Historical data is not available for {YAxisLabel}. </CardText>]
      if (this.props.historical[measurementId].length > 0) {
        //console.log("There are some data for " + measurementId + " " + JSON.stringify(this.state.historicalData[measurementId]));
        var title = 'Historical data graph for ' + measurementId;
        visComp = [<CardTitle title={title} /> ]
        var visComp2 = [
          <CardText>
          <LineChart width={800} height={400} data={this.props.historical[measurementId]} margin={{ top: 40, right: 40, bottom: 25, left: 50 }}>
            <Line type="monotone" fill="#8884d8" dataKey="value" stroke="#8884d8" dot={{ stroke: 'red', strokeWidth: 5 }} activeDot={{ stroke: 'yellow', strokeWidth: 8, r: 10 }} label={{ fill: 'red', fontSize: 20 }} name={measurementId} />
            <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
            <XAxis dataKey="time" padding={{ left: 30, right: 20 }} label="Time" name="Date" />
            <YAxis dataKey="value" padding={{ left: 20, right: 20, bottom: 40}} label={YAxisLabel} name={measurementId} />
            <Tooltip />
            (measurementId === 'SM1' || measurementId === 'SM2')? <ReferenceLine y={200} label="WET" padding={{ left: 10, right: 10 }} stroke="blue"/>
              <ReferenceLine y={1000} label="DRY" padding={{ left: 10, right: 10 }} stroke="red"/>
              : ;
          </LineChart>
        </CardText>]
        visComp = visComp.concat(visComp2);
      }
      visCompAll = visCompAll.concat(visComp);

    }
    return (
        <div>
            {visCompAll}
        </div>
    );
  }
}

export default SensorChart;
