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
    if(this.props.changeName) {
      if(this.state.edit) {
        title = 
          <div className="cardTitle">
            <TextField className="cardTitle" value={this.state.name} onChange={a => this.setState({name: a.target.value})} onBlur={a => {this.props.changeName(a.target.value); this.setState({edit: false})}}/>
            <EditIcon className="cardEditIcon" />
          </div>
      } else {
        title =
          <div className="cardTitle" onClick={() => this.setState({edit: true})}>
            <pre className="cardTitle"> {this.props.name} </pre>
            <EditIcon className="cardEditIcon" />
          </div>
      }
    } else {
      title =
        <div>
          <pre className="cardTitle"> {this.props.name} </pre>
        </div>
    }
    return (
      <Card className="measCard">
        {title}
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
    image: PropTypes.string.isRequired,
    changeName: PropTypes.func,
    lastUpdate: PropTypes.string,
    value: PropTypes.string 
  }
}

