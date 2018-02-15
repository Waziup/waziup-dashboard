import React, { Component } from 'react';
import sensorImage from '../../images/gauge.png';

export default class Measurement extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log("Measurement props:" + JSON.stringify(nextProps))
  }

  render() {
    let meas = this.props.measurement;
    return (
    <div className="measurement">
        <div className="measIcon">
          <img src={sensorImage} width="100" height="100" title={"Last reading at " + meas.timestamp}/>
        </div>
        <div className="measValue"> 
          <h3> {meas.last_value + " " + (meas.unit? meas.unit: null)} </h3>
        </div>
      <div className="measName"> 
        <h3> {meas.name} </h3>
      </div>
    </div>
    );
  }
}

