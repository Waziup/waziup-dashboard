import React, {Component} from 'react';
import { reduxForm } from 'redux-form';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

class LocationForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      location: Object.assign({}, this.initialLocation)
    };
  }
  initialLocation = this.props.initialLocation? this.props.initialLocation: {latitude: 12.238, longitude: -1.561};

  choosePosition = (formData) => {
    var location = this.state.location
    location.longitude = formData.latlng.lng
    location.latitude = formData.latlng.lat
    this.setState({location: location})
  }
  
  handleChange = (formData) => {
    var location = this.state.location
    location[formData.target.name] = parseFloat(formData.target.value);
    this.setState({location: location})
  }

  render() {
    const actions = [
      <Button color="primary" key='cancel' onTouchTap={()=>{this.props.handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.location); this.props.handleClose();}}>Submit</Button>,
    ];
    return (
      <Dialog actions={actions} modal open={this.props.modalOpen} autoScrollBodyContent={true}>
      <DialogTitle>Location</DialogTitle>
      <DialogContent>
        <Map className="map" center={[this.initialLocation.latitude, this.initialLocation.longitude]} zoom={5}>
          <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
          <Marker onDrag={(e)=>{this.choosePosition(e)}} position={[this.state.location.latitude, this.state.location.longitude]} draggable={true}>
            <Popup>
              <span>Your project position !</span>
            </Popup>
          </Marker>
         </Map>
         <div className="locationCoords">
          <Typography variant="subtitle1" style={{margin: 10}}>
            Project Location:
            </Typography> 
           <Grid container spacing={24}>
            <Grid item xs={6}>
              <TextField name="longitude" label="Longitude" value={this.state.location.longitude} onChange={this.handleChange}/>
           </Grid>
           <Grid item xs={6}>
            <TextField name="latitude"  label="Latitude"  value={this.state.location.latitude}  onChange={this.handleChange}/>
           </Grid>
        </Grid>
        </div>
        </DialogContent>
        <DialogActions>
            {actions}
          </DialogActions>
      </Dialog>
    );
  }
}

LocationForm.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialLocation: PropTypes.object //Should be a Waziup.Location
}

export default reduxForm({
    form: 'simple'
})(LocationForm)
