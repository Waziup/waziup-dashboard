import React, { Component } from 'react';
import chartImage from '../../../images/chart-icon.png';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ActuatorForm from './ActuatorForm';
import SensIcon from './SensIcon';
import { Link } from 'react-router';
import * as Waziup from 'waziup-js'
import config from '../../../config';

export default class ActuatorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let actu = this.props.actuator
    //Check if inactive delay expired
    let activeStyle = (actu.last_value && new Date() < Date.parse(actu.last_value.date_received) + config.delayDeviceInactive)? "cardGreen": "cardRed"
    let title = actu.last_value ? "Date received: " + actu.last_value.date_received : "No data yet"

    return (
      <Card className={"card " + activeStyle}>
        <ActuatorForm modalOpen={this.state.modalEdit}
                         handleClose={()=>{this.setState({modalEdit: false})}}
                         onSubmit={(m) => {this.props.updateActuator(this.props.deviceId, m); this.setState({modalEdit: false});}}
                         isEdit={true}
                         actuator={actu}/>
        <div className="TypographyDiv">
          <pre className="Typography"> {actu.name? actu.name : "(" + actu.id + ")"} </pre>
          <div className="cardTitleIcons"> 
            {this.props.permission.scopes.includes("devices:update")? <EditIcon onClick={() => this.setState({modalEdit: true})}/>: null}
            {this.props.permission.scopes.includes("devices:update")? <DeleteIcon onClick={() => {if(window.confirm('Delete actuator?')) this.props.deleteActuator(this.props.deviceId, actu.id)}}/>: null}
          </div>
        </div>
        <div className="cardContent">
          <div className="actuIcon">
            <SensIcon actuator_kind={actu.actuator_kind} height="75" title={title}/>
          </div>
          <div className="actuValue"> 
            <h3> {(actu.last_value? JSON.stringify(actu.last_value.value).replace(/"/g, ""): "") + " " + (actu.unit? Waziup.Units.getLabel(actu.unit): "")} </h3>
          </div>
          {!this.props.isDetails? 
            <Link to={"/devices/" + this.props.deviceId + "/" + actu.id} > 
              <div className="actuIcon">
                <img src={chartImage} height="75" title={"Go to actuator details"}/>
              </div>
            </Link> : null
          }
        </div>
      </Card>
    );
  }
  
  static propTypes = {
    actu: PropTypes.object, //Should be a Waziup.Actuator
    isEditable: PropTypes.bool,
    isDetails: PropTypes.bool,
    updateActuator: PropTypes.func,
    deleteActuator: PropTypes.func,
    deviceId: PropTypes.string.isRequired,
    permission: PropTypes.object.isRequired
  }
}

