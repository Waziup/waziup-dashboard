import React, { Component } from 'react';
import sensorImage from '../../../images/sensorNode.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'

export default class SensorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      name: this.props.name
    };
  }

  render() {
    var title={};
    if(this.state.edit) {
      title = <TextField className="cardTitle" value={this.state.name} onChange={a => this.setState({name: a.target.value})} onBlur={a => {this.props.changeName(a.target.value); this.setState({edit: false})}}/>
    } else {
      title = <pre className="cardTitle" onClick={() => this.setState({edit: true})}> {this.props.name} </pre>
    }
    return (
      <Card className="measCard">
        <div className="cardTitle">
          {title}
          <EditIcon className="cardEditIcon" />
        </div>
        <div className="cardContent">
          <div className="measIcon">
            <img src={this.props.image} height="100" title={"Last update at " + this.props.lastUpdate}/>
          </div>
          <div className="measValue"> 
            <h3> {this.props.value} </h3>
          </div>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    name: PropTypes.object.isRequired, //Should be a Waziup.Sensor
    changeName: PropTypes.func.isRequired,
    image: PropTypes.string.isRequired,
    lastUpdate: PropTypes.string,
    value: PropTypes.string 
  }
}

