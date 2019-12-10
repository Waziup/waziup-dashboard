import React, {Component} from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField'
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

class DeviceQRScan extends Component {

    constructor(props){
        super(props);
      }

    handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
      }

    render() {
        const {modalOpen, handleClose, onSubmit} = this.props;
        const actions = [ 
            <Button color="primary" key="cancel" onTouchTap={()=>{handleClose();}}>Cancel</Button>,
            <Button color="primary" key="submit" onTouchTap={()=>{this.props.onSubmit(this.state.device); handleClose();}}>Submit</Button>
        ];

        return (
            <Dialog actions={actions} modal="true" open={modalOpen}>
                <DialogTitle>{this.props.isEdit? "Update A Device": "Add A Device"}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={24}>
                        <Grid item xs={6}>
                        {/* <TextField name="domain"  label="Domain" fullWidth value={this.state.device.domain} onChange={this.handleChange} title="Domain this device belongs to"/> */}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                        {actions}
                </DialogActions>
            </Dialog>
          );
    };

    static propTypes = {
        modalOpen: PropTypes.bool.isRequired,
        handleClose: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        isEdit: PropTypes.bool
      }
}

export default DeviceQRScan