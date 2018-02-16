import React, { Component } from 'react';
import sensorImage from '../../../../images/gauge.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';

export default class MeasurementCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    let meas = this.props.measurement;
    return (
      <Card className="measCard">
        <CardTitle title={meas.name}/>
        <div className="measIcon">
          <img src={sensorImage} width="100" height="100" title={"Last reading at " + meas.timestamp}/>
        </div>
        <div className="measValue"> 
          <h3> {meas.last_value + " " + (meas.unit? meas.unit: null)} </h3>
        </div>
      </Card>
    );
  }

  propTypes = {
    measurement: PropTypes.object.isRequired //Should be a Waziup.Measurement
  }
}

