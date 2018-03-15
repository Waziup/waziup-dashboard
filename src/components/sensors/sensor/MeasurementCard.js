import React, { Component } from 'react';
import sensorImage from '../../../images/gauge.png';
import chartImage from '../../../images/chart-icon.png';
import PropTypes from 'prop-types';
import { Card, CardTitle } from 'material-ui/Card';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {grey} from 'material-ui/styles/colors';
import { TextField } from 'redux-form-material-ui'
import MeasurementForm from './MeasurementForm';
import { Link } from 'react-router';
import * as Waziup from 'waziup-js'
import config from '../../../config';

export default class MeasurementCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let meas = this.props.measurement
    let activeStyle = null 
    //Check if inactive delay expired
    if(new Date() > Date.parse(meas.timestamp) + config.delayInactiveMin) { 
      activeStyle = {"background-color": "#ff4141", "box-shadow": "rgb(0, 0, 0) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px"} //Red
    } else {
      activeStyle = {"background-color": "#32bf32", "box-shadow": "rgb(0, 0, 0) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px"} //Green
    }

    return (
      <Card className="measCard" style={activeStyle}>
        <MeasurementForm modalOpen={this.state.modalEdit}
                         handleClose={()=>{this.setState({modalEdit: false})}}
                         onSubmit={(m) => {this.props.updateMeasurement(this.props.sensorId, m); this.setState({modalEdit: false});}}
                         isEdit={true}
                         measurement={meas}/>
        <div className="cardTitleDiv">
          <pre className="cardTitle"> {meas.name? meas.name : "(" + meas.id + ")"} </pre>
          <div className="cardTitleIcons"> 
            <EditIcon onClick={() => this.setState({modalEdit: true})}/>
            <DeleteIcon onClick={() => this.props.deleteMeasurement(this.props.sensorId, meas.id)}/>
          </div>
        </div>
        <div className="cardContent">
          <div className="measIcon">
            <img src={sensorImage} height="100" title={"Last timestamp: " + meas.timestamp}/>
          </div>
          <div className="measValue"> 
            <h3> {(meas.last_value? meas.last_value: "") + " " + (meas.unit? Waziup.Units.getLabel(meas.unit): "")} </h3>
          </div>
          {this.props.isDetails? 
            <Link to={"/sensors/" + this.props.sensorId + "/" + meas.id} > 
              <div className="measIcon">
                <img src={chartImage} height="100" title={"Go to measurement details"}/>
              </div>
            </Link> : null
          }
        </div>
      </Card>
    );
  }
  
  propTypes = {
    meas: PropTypes.object.isRequired, //Should be a Waziup.Measurement
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateMeasurement: PropTypes.func,
    deleteMeasurement: PropTypes.func,
    sensorId: PropTypes.string.isRequired
  }
}

