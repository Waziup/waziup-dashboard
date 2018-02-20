import React, { Component } from 'react';
import sensorImage from '../../../images/gauge.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'
import MeasurementForm from './MeasurementForm';

export default class MeasurementCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let meas = this.props.measurement
    return (
      <Card className="measCard">
        <MeasurementForm modalOpen={this.state.modalEdit} handleClose={()=>{this.setState({modalEdit: false})}}
                         onSubmit={(m) => {this.props.changeMeasurement(m); this.setState({modalEdit: false});}}
                         isEdit={true} measurement={meas}/>
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {meas.name} </pre>
          <div className="cardTitleIcons"> 
            {this.props.isEditable? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null }
            {this.props.isEditable? <DeleteIcon onClick={() => this.props.deleteMeasurement(meas.id)}/>: null }
          </div>
        </div>
        <div className="cardContent">
          <div className="measIcon">
            <img src={sensorImage} height="100" title={"Last update at " + meas.timestamp}/>
          </div>
          <div className="measValue"> 
            <h3> {(meas.last_value? meas.last_value: "") + " " + (meas.unit? meas.unit: "")} </h3>
          </div>
        </div>
      </Card>
    );
  }
  
  propTypes = {
    meas: PropTypes.object.isRequired, //Should be a Waziup.Measurement
    isEditable: PropTypes.bool,
    changeMeasurement: PropTypes.func,
    deleteMeasurement: PropTypes.func
  }
}

