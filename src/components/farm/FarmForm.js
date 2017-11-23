import React, { Component } from 'react';
import { reduxForm, Field} from 'redux-form'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog';
import { Map, TileLayer, Marker, Popup, Circle, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import FlatButton from 'material-ui/FlatButton';
import { SelectField, TextField } from 'redux-form-material-ui'
//import SuperSelectField from 'material-ui-superselectfield'
import MenuItem from 'material-ui/MenuItem'
import { Row, Col } from 'react-grid-system'
import UTIL from '../../lib/utils.js'
//require('node_modules/leaflet-draw/dist/leaflet.draw.css')

class FarmForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [31.58, 74.32],
      sensor: {},
      servicePaths: [],
    };

    this._handleLatChange = this._handleLatChange.bind(this);
    this._handleLongChange = this._handleLongChange.bind(this);
  }


  _onEditPath(e) {
    console.log('Path edited !');
  }

  _onCreate = (e) => {
    var polyline = e.layer;
    // To edit this polyline call : polyline.handler.enable()
    console.log(polyline)
    var bounds = UTIL.convertVectorBounds(polyline._latlngs[0]);
    console.log(bounds);
    this.props.change('LayerField', bounds);
  }

  _onDeleted(e) {
    console.log('Path deleted !');
  }

  _mounted(drawControl) {
    console.log('Component mounted !');
  }

  _onEditStart() {
    console.log('Edit is starting !');
  }

  _onEditStop() {
    console.log('Edit is stopping !');
  }

  _onDeleteStart() {
    console.log('Delete is starting !');
  }

  _onDeleteStop() {
    console.log('Delete is stopping !');
  }

  componentWillReceiveProps(nextProps) {
    //permissions
    if (!!nextProps.permissions &&
      !!nextProps.allSps) {
      const permissions = nextProps.permissions
      const allSps = nextProps.allSps

      const sps = Array.from(UTIL.getEditServicePaths(permissions, allSps));
      this.setState({ servicePaths: sps });
      //console.log('selectedServicePaths', this.state.selectedServicePaths);
    }
  }

  _handleLatChange(e) {
    this.setState({
      position: [this.state.position[1], e.target.value]
    });
  }

  _handleLongChange(e) {
    this.setState({
      position: [e.target.value, this.state.position[0]]
    });
  }

  render() {
    const { reset, modalOpen, handleClose, onSubmit } = this.props;
    const { servicePaths } = this.state;
    const spList = servicePaths.map(sp => <MenuItem key={sp} value={sp} primaryText={sp} />);
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => {
          this.setState({ sensor: {} });
          reset();
          handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={() => {
          this.props.submit();
          handleClose();
        }}
      />,
    ];

    return (
      <Dialog
        title="Draw Your Farm"
        actions={actions}
        modal={true}
        open={modalOpen}
        autoScrollBodyContent={true}
        ref={'VectorMapDialog'}
      >
        {servicePaths.length > 0 &&
          <form onSubmit={onSubmit}>
            <Row>
              <Col md={4}>
                Farm ServicePath:<Field
                  component={SelectField}
                  name='servicePath'
                  hintText='Farm Service Path'
                  style={{ minWidth: 150, margin: 10 }}
                  ref="servicePath" withRef
                  
                >
                  {spList}
                </Field>
                Farm Name: <Field name="name"
                  component={TextField}
                  hintText="Farm Name"
                  ref="name" withRef value='aaa'/>
                Over Dry Zone: <Field name="overDryZone"
                  component={TextField}
                  hintText="Over Dry Zone"
                  ref="overDryZone" withRef />
                Over Irrigation Zone: <Field name="overIrrigationZone"
                  component={TextField}
                  hintText="Over Irrigation Zone"
                  ref="overIrrigationZone" withRef />
                Irrigation Type: <Field name="irrigationType"
                  component={TextField}
                  hintText="Drip irrigation, Surface irrigation"
                  ref="irrigationType" withRef />
                Crops: <Field name="crop"
                  component={TextField}
                  hintText="Mais"
                  ref="crop" withRef />
                Address: <Field name="address"
                  component={TextField}
                  hintText="Pakistan"
                  ref="address" withRef />
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                Farm Localization:
                <Field name="long"
                  component={TextField}
                  hintText="Longitude"
                  value={this.state.position[1]} onChange={this._handleLongChange}
                />
                <Field name="lat"
                  component={TextField}
                  hintText="Latitude"
                  value={this.state.position[0]} onChange={this._handleLatChange} />
              </Col>
              <Col>
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css" />
                <Map className="FarmForm" ref="map" center={this.state.position} zoom={5}>
                  <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={this.state.position}>
                    <Popup>
                      <span>
                        Your Initial Coordinate
                     </span>
                    </Popup>
                  </Marker>
                  <FeatureGroup>
                    <EditControl
                      position='topright'
                      onEdited={this._onEditPath}
                      onCreated={this._onCreate}
                      onDeleted={this._onDeleted}
                      draw={{ rectangle: false, circle: true, marker: true, polyline: false }}
                    />
                    <Circle center={[51.51, -0.06]} radius={200} />
                  </FeatureGroup>
                </Map>
              </Col>
            </Row>
          </form>}
      </Dialog>
    );
  }
}

FarmForm = reduxForm({
  form: 'FarmForm',
  enableReinitialize: true,
})(FarmForm)

FarmForm = connect(
  state => ({
    initialValues: {
      address: !!state.farm.farm.address?state.farm.farm.address.value: null,
      crop: !!state.farm.farm.crop?state.farm.farm.crop.value:null,   
      servicePath: !!state.farm.farm.servicePath?state.farm.farm.servicePath.value:null,
      name: !!state.farm.farm.servicePath?state.farm.farm.name.value:null,
      irrigationType: !!state.farm.farm.irrigationType?state.farm.farm.irrigationType.value:null,
      overIrrigationZone: !!state.farm.farm.overIrrigationZone?state.farm.farm.overIrrigationZone.value:80,
      overDryZone: !!state.farm.farm.overDryZone?state.farm.farm.overDryZone.value:30}
  }))(FarmForm)

export default FarmForm;