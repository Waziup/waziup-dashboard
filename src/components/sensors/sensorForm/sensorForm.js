import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col} from 'react-grid-system'

const position = [12.238, -1.561];

class sensorForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      sensor: {
        sensorLat: 12.238000,
        sensorLon: -1.561111,
        sensorId: 'MySensor'
      }
    };
  }

  choosePosition = (formData) => {
    var sensor = this.state.sensor
    sensor.sensorLon = formData.latlng.lng
    sensor.sensorLat = formData.latlng.lat
    this.setState({sensor: sensor})
  }
  
  handleChange = (formData) => {
    var sensor = this.state.sensor
    sensor[formData.target.name] = formData.target.value;
    this.setState({sensor: sensor})
  }

  render() {
    const {reset, modalOpen, handleClose, onSubmit} = this.props;
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            reset();
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          console.log("onSubmit")
          this.props.onSubmit(this.state.sensor);
          handleClose();
        }}
      />,
    ];

    return (
        <Dialog
              title="Add New Sensor"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'sensorFormDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
                <Col md={8}>
                   <Map  className="sensorform" ref="map" center={position} zoom={5}>
                    <TileLayer
                      url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker onDrag={(e)=>{this.choosePosition(e)}} position={[this.state.sensor.sensorLat, this.state.sensor.sensorLon]} draggable={true}>
                      <Popup>
                        <span>Your sensor position !</span>
                      </Popup>
                    </Marker>
                    </Map>
                </Col>
                <Col md={4}>
                    <div>Sensor Location:</div>
                    <TextField name="sensorLon"
                      hintText="Longitude"
                      floatingLabelText="Longitude"
                      value={this.state.sensor.sensorLon}
                      onChange={this.handleChange}
                      />
                    <TextField
                      name="sensorLat"
                      hintText="Latitude"
                      floatingLabelText="Latitude"
                      value={this.state.sensor.sensorLat}
                      onChange={this.handleChange}
                      />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <TextField name="sensorId"
                  id='sensorId'
                  hintText="Sensor id"
                  floatingLabelText="Sensor Id"
                  value={this.state.sensor.sensorId}
                  onChange={this.handleChange}
                  />
              </Col>
            </Row>
          </form>
        </Dialog>
      );
  }
}

export default sensorForm
