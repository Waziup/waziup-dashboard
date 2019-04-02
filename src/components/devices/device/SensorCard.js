import React, { Component } from 'react';
import chartImage from '../../../images/chart-icon.png';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SensorForm from './SensorForm';
import SensIcon from './SensIcon';
import { Link } from 'react-router';
import * as Waziup from 'waziup-js'
import config from '../../../config';

export default class SensorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let sens = this.props.sensor
    //Check if inactive delay expired
    let activeStyle = (sens.last_value && new Date() < Date.parse(sens.last_value.date_received) + config.delayDeviceInactive)? "cardGreen": "cardRed"
    let title = sens.last_value ? "Date received: " + sens.last_value.date_received : "No data yet"

    return (
      <Card className={"card " + activeStyle}>
        <SensorForm modalOpen={this.state.modalEdit}
                         handleClose={()=>{this.setState({modalEdit: false})}}
                         onSubmit={(m) => {this.props.updateSensor(this.props.deviceId, m); this.setState({modalEdit: false});}}
                         isEdit={true}
                         sensor={sens}/>
        <div className="TypographyDiv">
          <pre className="Typography"> {sens.name? sens.name : "(" + sens.id + ")"} </pre>
          <div className="cardTitleIcons"> 
            {this.props.permission.scopes.includes("devices:update")? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null}
            {this.props.permission.scopes.includes("devices:update")? <DeleteIcon onClick={() => {if(window.confirm('Delete sensor?')) this.props.deleteSensor(this.props.deviceId, sens.id)}}/>: null}
          </div>
        </div>
        <div className="cardContent">
          <div className="sensIcon">
            <SensIcon sensor_kind={sens.sensor_kind} height="75" title={title}/>
          </div>
          <div className="sensValue"> 
            <h3> {(sens.last_value? JSON.stringify(sens.last_value.value).replace(/"/g, ""): "") + " " + (sens.unit? Waziup.Units.getLabel(sens.unit): "")} </h3>
          </div>
          {!this.props.isDetails? 
            <Link to={"/devices/" + this.props.deviceId + "/" + sens.id} > 
              <div className="sensIcon">
                <img src={chartImage} height="75" title={"Go to sensor details"}/>
              </div>
            </Link> : null
          }
        </div>
      </Card>
    );
  }
  
  static propTypes = {
    sens: PropTypes.object, //Should be a Waziup.Sensor
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateSensor: PropTypes.func,
    deleteSensor: PropTypes.func,
    deviceId: PropTypes.string.isRequired,
    permission: PropTypes.object.isRequired
  }
}

