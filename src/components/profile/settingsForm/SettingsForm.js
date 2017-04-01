import React, {Component} from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
//import FlatButton from 'material-ui/FlatButton';
 import RaisedButton from 'material-ui/RaisedButton';
import UTIL from '../../../utils.js';
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui'
import {  Row, Col, Visible} from 'react-grid-system'
import { initialize } from 'redux-form'
// validation functions
const required = value => value == null ? 'Required' : undefined

class settingsForm extends Component {
  constructor(props){
    super(props);
    this.state = {
        form:{}
    };
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps){

  }

  render() {
    const {pristine, reset, submitting, onSubmit} = this.props;

    return (
          <form onSubmit={onSubmit}>
            <Row>
              <Col md={4}>
                <Field name="ServicePath"
                  component={TextField}
                  hintText="Fiware-ServicePath"
                  floatingLabelText="Fiware-ServicePath"
                  ref="ServicePath" withRef/>
              </Col>
              <Col md={4} offset={{md:2}}>
                <Field
                  name="Phone"
                  component={TextField}
                  hintText="Phone Number"
                  floatingLabelText="Phone Number"
                   ref="Phone" withRef />
              </Col>
              </Row>
            <Row>
              <Col md={2} offset={{md:10}}>
                  <RaisedButton
                    label="Submit"
                    primary={true}
                    onTouchTap={()=>{
                      this.props.submit();
                    }}
                  />
                </Col>
            </Row>
          </form>
      );
  }
}
// Decorate with redux-form
settingsForm = reduxForm({
  form: 'settingsForm',
  enableReinitialize : true, // this is needed!!
})(settingsForm)
settingsForm = connect(
  state => ({
    initialValues: {
      'ServicePath': state.currentUser.currentUser.attributes ? (state.currentUser.currentUser.attributes.ServicePath ? state.currentUser.currentUser.attributes.ServicePath[0] : "" ) : "",
      'Phone': state.currentUser.currentUser.attributes ? (state.currentUser.currentUser.attributes.Phone ? state.currentUser.currentUser.attributes.Phone[0]:"") : ""
    }
  })
)(settingsForm)

export default settingsForm;

