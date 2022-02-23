import React, {Component, useRef, createRef} from 'react';
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
import { geolocated } from "react-geolocated";


class LocationForm extends Component {

  constructor(props) {
    super(props);
    let initialLocation = {};
    if(this.props.initialLocation) {
      initialLocation = this.props.initialLocation;
    } else {
      initialLocation = {latitude: 12.238, longitude: -1.561};
    }
 
    //setting center of map and pointer location
    this.state = {
      location: initialLocation,
      center: initialLocation,
      zoom: 5
    };
  }

  //Get position from the browser
  setBrowserPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let loc = { 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude};
      this.setState({ location: loc, center: loc});
    }, err => {
      console.log(err);
      alert(err.message + "\nCheck your browser settings");
    }
    );
    console.log(this.state.position)
  }
  
  centerOnMarker = () => {
    this.setState({center: this.state.location});
  }

  onMarkerMove = (formData) => {
    location.longitude = formData.latlng.lng
    location.latitude = formData.latlng.lat
    this.setState({location: location})
  }
  
  onFieldChange = (formData) => {
    var location = this.state.location
    let val = parseFloat(formData.target.value);
    //Check if val is a real number
    if (Number(val) === val) {
      location[formData.target.name] = val 
      this.setState({location: location})
      this.centerOnMarker();
    }
  }

  //onMapMove = (e: LeafletEvent) => {
  onMapMove = (e) => {
    const { lat, lng: lon } = e.target.getCenter()
    const zoom = e.target.getZoom()
    this.setState({center: {latitude: lat, longitude: lon}, zoom: zoom})
  }


  render() {
    const actions = [
      <Button color="primary" key='cancel' onTouchTap={()=>{this.props.handleClose();}}>Cancel</Button>,
      <Button color="primary" key='submit' onTouchTap={()=>{this.props.onSubmit(this.state.location); this.props.handleClose();}}>Submit</Button>,
    ];
    return (
      <Dialog actions={actions} modal open={this.props.modalOpen} autoScrollBodyContent={true}>
        <DialogTitle> Change location... 
          <Button className="cardTitleIcons" onTouchTap={() => { this.setBrowserPosition() }} variant="contained" color="primary">
            Get your location
          </Button>
        </DialogTitle>
        <DialogContent>
          <Map className="map"
               center={[this.state.center.latitude, this.state.center.longitude]}
               zoom={this.state.zoom}
               onmoveend={this.onMapMove}>
            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <Marker onDrag={(e)=>{this.onMarkerMove(e)}}
                    position={[this.state.location.latitude, this.state.location.longitude]}
                    draggable={true}>
              <Popup>
                <span>Your device position !</span>
              </Popup>
            </Marker>
          </Map>
          <div className="locationCoords">
            <Typography variant="subtitle1" style={{margin: 10}}>
              Device Location:
            </Typography> 
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <TextField name="longitude" label="Longitude" value={this.state.location.longitude} onChange={this.onFieldChange}/>
              </Grid>
              <Grid item xs={6}>
                <TextField name="latitude"  label="Latitude"  value={this.state.location.latitude}  onChange={this.onFieldChange}/>
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
