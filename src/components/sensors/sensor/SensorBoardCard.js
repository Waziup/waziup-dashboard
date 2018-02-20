import React, { Component } from 'react';
import sensorImage from '../../../images/sensorNode.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'
import sensorNodeImage from '../../../images/sensorNode.png';

export default class SensorBoardCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let sensor = this.props.sensor
    return (
      <Card className="measCard">
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {sensor.name} </pre>
          <div className="cardTitleIcons"> 
            {this.props.edit? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
          </div>
        </div>
        <div className="cardContent">
          <div className="measIcon">
            <img src={sensorNodeImage} height="100" title={sensor.dateUpdated? "Last update at " + sensor.dateUpdated: "No data yet"}/>
          </div>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    edit: PropTypes.func.isRequired,
  }
}

