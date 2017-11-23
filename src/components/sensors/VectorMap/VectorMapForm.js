import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, TileLayer, Circle, FeatureGroup } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import FlatButton from 'material-ui/FlatButton';
import { SelectField, TextField } from 'redux-form-material-ui'
//import SuperSelectField from 'material-ui-superselectfield'
import MenuItem from 'material-ui/MenuItem'

import { Row, Col } from 'react-grid-system'
import UTIL from '../../../lib/utils.js'

class VectorMapForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [31.58, 74.32],
      sensor: {
      },
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
      position: [e.target.value, this.state.position[1]]
    });
  }

  _handleLongChange(e) {
    this.setState({
      position: [this.state.position[0], e.target.value]
    });
  }

  render() {
    const { reset, modalOpen, handleClose, onSubmit } = this.props;
    const { servicePaths } = this.state;
    const spList = servicePaths.map(sp => <MenuItem key={sp} value={sp} primaryText={sp} />);

    const actionsLocalization = [
      <FlatButton
        type="reset"
        label="Reset"
        secondary={true}
        style={{ float: 'left' }}
      />,
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        type="submit"
        label="Submit"
        primary={true}
      />,
    ];
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
                  ref="name" withRef />
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
                  <Field name="lat"
                  component={TextField}
                  hintText="Latitude"
                  value={this.state.position[0]} onChange={this._handleLatChange} />
                <Field name="long"
                  component={TextField}
                  hintText="Longitude"
                  value={this.state.position[1]} onChange={this._handleLongChange}
                />

              </Col>
              <Col>
                <Map className="VectorMapForm" ref="map" center={this.state.position} zoom={5}>
                  <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <FeatureGroup>
                    <EditControl
                      position='topright'
                      onEdited={this._onEditPath}
                      onCreated={this._onCreate}
                      onDeleted={this._onDeleted}
                      draw={{ rectangle: false, circle: false, marker: false, polyline: false }}
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

const initialValues = {
  LayerField: '',
};
// Decorate with redux-form
VectorMapForm = reduxForm({
  form: 'VectorMapForm',
  initialValues,
})(VectorMapForm)

export default VectorMapForm;