import React, { Component } from 'react';
import actuatorImage from '../../../../images/actuator.png';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ActuatorForm from './ActuatorForm';
import { Link } from 'react-router';

export default class ActuatorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalEdit: false,
    };
  }

  render() {
    let actu = this.props.actuator

    return (
      <Card className={"card "}>
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
          {this.props.isDetails? 
          <div className="sensIcon">
            <img src={actuatorImage} height="75"/>
          </div> : null
          }
          {!this.props.isDetails? 
            <Link to={"/devices/" + this.props.deviceId + "/actuators/" + actu.id} > 
              <div className="actuIcon">
                <img src={actuatorImage} height="75" title={"Go to actuator details"}/>
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

