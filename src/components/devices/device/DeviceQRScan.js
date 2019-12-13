import React, {Component} from 'react';
import QrReader from 'react-qr-reader'
import Webcam from "react-webcam";
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
        this.state = {
            result: 'No result',
            screenshot: null,
            tab: 0
          };
      }
      handleClick = () => {
        const screenshot = this.webcam.getScreenshot();
        this.setState({ screenshot });
      }
    handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
      }

      handleClick = () => {
        const screenshot = this.webcam.getScreenshot();
        this.setState({ screenshot });
      }

      handleSubmit = () => {
        console.log("Screenshot ", this.state.screenshot)
      }

      handleScan = data => {
        if (data) {
          this.setState({
            result: data
          })
        }
      }

      handleError = err => {
        console.error(err)
      }

    render() {
        const {modalOpen, handleClose, onSubmit} = this.props;
        const actions = [ 
            <Button color="primary" key="cancel" onTouchTap={()=>{handleClose();}}>Cancel</Button>,
            <Button color="primary" key="submit" onTouchTap={this.handleSubmit}>Console Log</Button>
        ];
            
            // for adding circular button for later taking photo shot
            // https://github.com/MABelanger/react-html5-camera-photo/blob/master/src/lib/components/Camera/index.js

        const videoConstraints = {
            // https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode
            facingMode: { exact: "user" }//if changed to "user" then the camer works for webcam.
          };

        return (
            <Dialog actions={actions} modal="true" open={modalOpen}>
                <DialogTitle>{this.props.isEdit? "Update A Device": "Add A Device"}</DialogTitle>
                <DialogContent>
                {/* <div>
                    <h1>react-webcam</h1>
                    <Webcam
                        audio={false}
                        // videoConstraints={videoConstraints}
                        ref={node => this.webcam = node}/>
                    <div>
                        <h2>Screenshots</h2>
                        <div className='screenshots'>
                            <div className='controls'>
                                <button onClick={this.handleClick}>capture</button>
                            </div>
                            {this.state.screenshot ? <img src={this.state.screenshot} /> : null}
                        </div>
                    </div>
                </div> */}
                  <div>
                    <QrReader
                      delay={300}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '100%' }}
                    />
                    <p>{this.state.result}</p>
                  </div>
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
        onSubmit: PropTypes.func.isRequired
      }
}

export default DeviceQRScan