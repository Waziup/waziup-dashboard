import React, { Component } from 'react';
import sensorImage from '../../images/gauge.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'
import { Link } from 'react-router';

export default class NotifCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false
    };
  }

  render() {
    let notif = this.props.notif
    return (
      <Card className="measCard">
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {notif.subject.entityNames} </pre>
          <div className="cardTitleIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => this.props.deleteNotification(notif.id)}/>: null }
          </div>
        </div>
        <div className="cardContent">
          <Link to={this.props.isEditable? "/notifications/" + notif.id: ""} > 
            <div className="measIcon">
              <img src={sensorImage} height="100"/>
            </div>
            <div className="measValue"> 
              <h3> {(notif.subject.condition.expression? notif.subject.condition.expression: "")} </h3>
            </div>
          </Link>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    notif: PropTypes.object.isRequired, //Should be a Waziup.Notification
    isEditable: PropTypes.bool
  }
}

