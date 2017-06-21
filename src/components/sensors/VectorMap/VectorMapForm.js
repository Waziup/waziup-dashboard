import React, {Component} from 'react';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, TileLayer ,Circle ,FeatureGroup} from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import FlatButton from 'material-ui/FlatButton';
import { TextField } from 'redux-form-material-ui'
import { Row, Col } from 'react-grid-system'
import UTIL from '../../../utils.js'
const position = [12.238, -1.561];

class VectorMapForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      position : [12.238000,-1.561111],
      sensor:{
      }
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
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
     this.props.change('LayerField',bounds);
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
  render() {
    const {reset, modalOpen, handleClose, onSubmit} = this.props;
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            this.setState({sensor:{}});
            reset();
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
            console.log("ici");
            this.props.submit();
            handleClose();
        }}
      />,
    ];

    return (
        <Dialog
              title="Draw crop or pond"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'VectorMapDialog'}
            >
          <form onSubmit={onSubmit}>
            <Row>
              <Col md={4}>
                <Field name="FieldId"
                  component={TextField}
                  hintText="Field Id"
                  floatingLabelText="Field Id"
                  ref="fieldId" withRef/>
              </Col>
          </Row>
          <Row>
                <Col>
                   <Map  className="VectorMapForm" ref="map" center={position} zoom={5}>
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
                            draw={{rectangle: false, circle:false, marker:false, polyline:false}}
                          />
                          <Circle center={[51.51, -0.06]} radius={200} />
                        </FeatureGroup>
                    </Map>
                </Col>
            </Row>
          </form>
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

