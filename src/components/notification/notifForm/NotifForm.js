import React, {Component} from 'react';
import { reduxForm, Field,FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import UTIL from '../../../utils.js';
import MenuItem from 'material-ui/MenuItem'
import { RadioButton } from 'material-ui/RadioButton'
import IconButton from 'material-ui/IconButton';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Delete from 'material-ui/svg-icons/action/delete';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui'
import {  Row, Col, Visible} from 'react-grid-system'
import { initialize } from 'redux-form'


class notifForm extends Component {
  constructor(props){
    super(props);
    console.log("notif State " + JSON.stringify(this.state));
    this.state = {
      notif: {},
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
    console.log("notif props " + JSON.stringify(nextProps));
  }

  render() {
    const {pristine, reset, submitting, modalShowing, modalOpen, handleClose, onSubmit, formData} = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={()=>{
            this.setState({notif:{}});
            reset();
            handleClose();
        }}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          this.props.submit();
          handleClose();
        }}
      />,
    ];
    
    const renderHeaders = ({ fields, meta: { touched, error, submitFailed } }) => (  
        <ul>    
          <RaisedButton label="Add header" name="addheader"  primary={true} onClick={() => fields.push({})}/>
          {(touched || submitFailed) && error && <span>{error}</span>}
        {fields.map((member, index) =>
          <li key={index}> 
          <table>
           <tr>
            <td>
            <Field
              name={`${member}.headerName`}
              component={TextField}
              label={`header value ${index}`}>
            </Field>  
            </td>   
            <td>
            <Field
               name={`${member}.headerValue`}
              type="text"
              component={TextField}
              label="Header"/>  
           </td>
           <td>     
            <RaisedButton
              label="Remove"
              name="removesensor"
              secondary={true}
              onClick={() => fields.remove(index)}/>      
            </td>   
            </tr>
           </table>
          </li>
        )}
      </ul>
    );

    return (
        <Dialog
              title="Add new Notification"
              actions={actions}
              modal={true}
              open={modalOpen}
              autoScrollBodyContent={true}
              ref={'notifFormDialog'}
            >
          <form onSubmit={onSubmit}>
           <Col>
              <Row>
                <Field name="desc"
                  fullWidth={true}
                  component={TextField}
                  floatingLabelText="Description"
                  ref="description" withRef/>
              </Row>
              <Row>
                <Field name="sensors"
                  component={SelectField}
                  multiple={true}
                  floatingLabelText="Sensors"
                  ref="sensors" withRef>
                    <MenuItem value={"A"} primaryText="Sensor1" />
                    <MenuItem value={"B"} primaryText="Sensor2" />
                </Field>
                <Field name="attrs"
                  component={SelectField}
                  multiple={true}
                  hintText="attributes"
                  floatingLabelText="Attributes"
                  ref="sensors" withRef>
                    <MenuItem value={1} primaryText="Attr1" />
                    <MenuItem value={2} primaryText="Attr2" />
                </Field>
              </Row>
              <Row>
                <Field name="expr"
                  component={TextField}
                  fullWidth={true}
                  hintText="expression"
                  floatingLabelText="Expression"
                  ref="expression" withRef>
                </Field>
              </Row>
              <Row>
                <Field name="url"
                  component={TextField}
                  fullWidth={true}
                  hintText="URL"
                  floatingLabelText="URL"
                  ref="url" withRef>
                </Field>
              </Row>
              <Row>
                <FieldArray name="headers"
                  fullWidth={true}
                  component={renderHeaders}
                  hintText="Headers"
                  floatingLabelText="Headers"
                  ref="headers" withRef>
                </FieldArray>
              </Row>
              <Row>
                <Field name="payload"
                  component={TextField}
                  fullWidth={true}
                  hintText="Payload"
                  floatingLabelText="Payload"
                  ref="payload" withRef>
                </Field>
              </Row>
              <Row>
                <Field name="expires"
                  component={DatePicker}
                  hintText="Expires"
                  floatingLabelText="Expires"
                  ref="expires" withRef>
                </Field>
                <Field name="throttling"
                  component={TextField}
                  hintText="throttling"
                  floatingLabelText="Throttling"
                  ref="throttling" withRef>
                </Field>
            </Row>
           </Col>
          </form>
        </Dialog>
      );
  }
}

// Decorate with redux-form
notifForm = reduxForm({
  form: 'notifForm',
  enableReinitialize : true, // this is needed!!
})(notifForm)

notifForm = connect(
  state => ({
    initialValues:{
        desc: "Send XXX when YYY",
        sensors: ["A","B"],
        attrs: [1], 
        expr: "SM1>400", 
        url: "https://api.plivo.com/v1/Account/MAMDA5ZDJIMDM1NZVMZD/Message/", 
        headers: [{ headerName: "Content-type",  headerValue: "application/json"}, 
                  { headerName: "Authorization", headerValue: "Basic TUFNREE1WkRKSU1ETTFOWlZNWkQ6TnpSbE5XSmlObVUyTW1GallXSmxPRGhsTlRrM01Ua3laR0V6TnpJeQ=="}],
        payload: "{ \"src\": \"00393806412092\", \"dst\": \"00393806412093\", \"text\": \"WaterSense: Field is too dry. ${id} humidity value is ${SM1} \"}", 
        expires: new Date("2040-05-24T20:00:00.00Z"), 
        throttling: 1, 
    }
  })
)(notifForm)
export default notifForm;

