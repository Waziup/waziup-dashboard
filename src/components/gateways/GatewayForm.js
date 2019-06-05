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
      device: this.props.device
    };
  }
  
  handleChange = (formData) => {
    var device = this.state.device
    device[formData.target.name] = formData.target.value;
    this.setState({device: device})
  }

  render() {
    const {modalOpen, handleClose, onSubmit} = this.props;
    const actions = [ 
      <Button color="primary" key='cancel' onTouchTap={()=>{handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.device); handleClose();}}>Submit</Button>,
    ];

    return (
        <Dialog modal={true} open={modalOpen}>
        <DialogTitle>Update Gateway ID</DialogTitle>
        <DialogContent>
          <TextField disabled={true} name="id" label="Device ID" value={this.state.device.id} onChange={this.handleChange} title="ID used by the gateway to send data"/>
          <TextField name="gateway_id"  label="Gateway ID" value={this.state.device.gateway_id} onChange={this.handleChange} title="ID of the gateway attached to the device"/>
        </DialogContent>
        <DialogActions>
            {actions}
        </DialogActions>
         </Dialog>
      );
  }

  static propTypes = {
    device: PropTypes.object.isRequired,
    modalOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }
}

export default reduxForm({form: 'simple'})(GatewayForm)
