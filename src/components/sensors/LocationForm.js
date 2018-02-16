import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'
import PropTypes from 'prop-types';
import * as Waziup from 'waziup-js'

const position = [12.238, -1.561];

class LocationForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      location: Object.assign({}, props.initialLocation)
    };
  }

  choosePosition = (formData) => {
    var location = this.state.location
    location.longitude = formData.latlng.lng
    location.latitude = formData.latlng.lat
    this.setState({location: location})
  }
  
  handleChange = (formData) => {
    var location = this.state.location
    location[formData.target.name] = formData.target.value;
    this.setState({location: location})
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onTouchTap={()=>{this.props.handleClose();}}/>,
      <FlatButton label="Submit" primary={true} onTouchTap={()=>{this.props.onSubmit(this.state.location); this.props.handleClose();}}/>,
    ];

    return (
      <Dialog title="Location" actions={actions} modal={true} open={this.props.modalOpen} autoScrollBodyContent={true}>
        <form onSubmit={this.props.onSubmit(this.state.location)}>
          <Map className="map" center={position} zoom={5}>
            <TileLayer url='http://{s}.tile.osm.org/{z}/{x}/{y}.png' attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
            <Marker onDrag={(e)=>{this.choosePosition(e)}} position={[this.state.location.latitude, this.state.location.longitude]} draggable={true}>
              <Popup>
                <span>Your sensor position !</span>
              </Popup>
            </Marker>
           </Map>
           <div className="locationCoords">
             <h3> Sensor Location: </h3>
             <TextField name="longitude" floatingLabelText="Longitude" value={this.state.location.longitude} onChange={this.handleChange}/>
             <TextField name="latitude" floatingLabelText="Latitude"  value={this.state.location.latitude} onChange={this.handleChange}/>
          </div>
        </form>
      </Dialog>
    );
  }
}

LocationForm.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialLocation: function(props, propName, componentName) {
    if (props[propName]) {
      let value = props[propName];
      if (typeof value != 'Location') {
        return new Error('Invalid prop `' + propName + '` supplied to' + ' `' + componentName + '`. Validation failed.');
      }
    }
  }
}

export default reduxForm({
    form: 'simple'
})(LocationForm)
