import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';

class GatewayForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      sensor: this.props.sensor
    };
  }
  
  handleChange = (formData) => {
    var sensor = this.state.sensor
    sensor[formData.target.name] = formData.target.value;
    this.setState({sensor: sensor})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button color="primary" key='cancel' onTouchTap={()=>{handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.sensor); handleClose();}}>Submit</Button>,
    ];

    return (
        <Dialog modal={true} open={modalOpen}>
        <DialogTitle>Update Gateway ID</DialogTitle>
        <DialogContent>
          <TextField disabled={true} name="id" label="Sensor ID" value={this.state.sensor.id} onChange={this.handleChange} title="ID used by the gateway to send data"/>
          <TextField name="gateway_id"  label="Gateway ID" value={this.state.sensor.gateway_id} onChange={this.handleChange} title="ID of the gateway attached to the sensor"/>
        </DialogContent>
        <DialogActions>
            {actions}
        </DialogActions>
         </Dialog>
      );
  }

  static propTypes = {
    sensor: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
}

export default reduxForm({form: 'simple'})(GatewayForm)
