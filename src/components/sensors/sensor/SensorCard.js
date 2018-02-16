import React, { Component } from 'react';
import sensorImage from '../../../images/sensorNode.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import {grey} from 'material-ui/styles/colors';
import { SelectField, TextField } from 'redux-form-material-ui'

export default class SensorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      name: this.props.sensor.name
    };
  }

  componentWillReceiveProps(nextProps) {
  }


  render() {
    let sensor = this.props.sensor;
    var title={};
    if(this.state.edit) {
      title = <TextField className="cardTitle" value={this.state.name} onChange={a => this.setState({name: a.target.value})} onBlur={a => {this.props.changeName(a.target.value); this.setState({edit: false})}}/>
    } else {
      title = <pre className="cardTitle" onClick={() => this.setState({edit: true})}> {sensor.name} </pre>
    }
    return (
      <Card className="measCard">
         {title}
          <EditIcon className="cardEditIcon" />
        <div className="measIcon">
          <img src={sensorImage} width="150" height="100" title={"Last update at " + sensor.dateUpdated}/>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    sensor: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    changeName: PropTypes.func.isRequired
  }
}

