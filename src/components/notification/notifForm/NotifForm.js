import React, {Component} from 'react';
import { reduxForm, Field,FieldArray,formValueSelector } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
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
      notifValue:''
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps){
    console.log("notif form props " + JSON.stringify(nextProps));
  }

  render() {
    const {pristine, reset, submitting, modalShowing, modalOpen, handleClose, onSubmit, formData, sensors,facebooknum,notiftype} = this.props;
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
              name={`${member}.key`}
              component={TextField}
              label={`header value ${index}`}>
            </Field>  
            </td>   
            <td>
            <Field
               name={`${member}.value`}
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

    let sensorList = sensors.map((s) =>  <MenuItem value={s.id} primaryText={s.id} />) 
    let attrsList = () => {
       var attrsList = []
       for(let s of this.props.sensors) {
          let attrs = UTIL.getMeasurements(s).map((m) => m.key)
          attrsList.push(attrs)
       }
      let attrsList2 = uniq([].concat.apply([], attrsList))
      return attrsList2.map((a) => <MenuItem value={a} primaryText={a}/>)
    }


    function uniq(a) {
    return a.sort().filter(function(item, pos, array) {
        return !pos || item != array[pos - 1];
    })
}
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
                    {sensorList}
                </Field>
                <Field name="attrs"
                 component={SelectField}
                 
                  multiple={true}
                  hintText="attributes"
                  floatingLabelText="Attributes"
                  ref="sensors" withRef>
                    {attrsList()}
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
<fieldset  >
<legend  > Facebook Information</legend  >
  <Field name="facebooknum" 
                component={TextField}
                fullWidth={false}
                  hintText="facebook number"
                  ref="facebooknum" withRef>
                </Field>

                <Field name="facebookuserID" 
                component={TextField}
                fullWidth={false}
                  hintText="facebook ID"
                  ref="facebookuserID" withRef>
                </Field>

  </fieldset>
 </Row>
  <Divider inset={true} />
  <Row>
  
  
                <Field name="notiftype"
                
              
                    component="select"
                  fullWidth={false}
                  hintText="Select a notification type"
               
                  ref="notiftype" withRef
                  onChange=
                  {
                    (e)=>{
                             
               if(e.target.value==="facebook" && this.props.facebooknum)
               {
                 
                 this.props.change('url','https://graph.facebook.com/v2.6/me/messages')
               this.props.change('payload', '{ %22phone_number%22:%22'+this.props.facebooknum+'%22 }, %22message%22: {%22text%22:%22Waziup: humidity too high: \${id} value is \${SM1}%22}')
               this.props.change('qs','access_token:EAAIcoXbuoZBgBANLgZCViOLxWPJtsIn1El4fasUC75LwNxfZCnoCrEwLLt6obg4HZAzhPt1aTPpAYJaKAx6ir07POprw22ltnpHZARBhVVg3E3INbfeiZAmqCRhyqHQUW3GJmPSpUB0gQpHKCy1IcvThUPgw8RTrXEfsKqjiUmzwZDZD')
              }
              else
              { 
                if(e.target.value==="sms")
                 {
           
              this.props.change('url','https://api.plivo.com/v1/Account/MAMDA5ZDJIMDM1NZVMZD/Message/')
              this.props.change('payload','{ \"src\": \"00393806412092\", \"dst\": \"00393806412093\", \"text\": \"WaterSense: Field is too dry. ${id} humidity value is ${SM1} \"}')
            }
            else
            {
                alert('You must give a phone number')
           
               }
              }
                 
               
            }}
                  >
                  
            

             <option value="facebook">Select A notification type</option>
                    
            <option value="facebook">Facebook</option>
            
            <option value="sms">Sms</option>
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
                <Field name="qs"
                  component={TextField}
                  fullWidth={true}
                  hintText="QS"
                  floatingLabelText="QS"
                  ref="qs" withRef>
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
  enableReinitialize : true, 
})(notifForm)
const selector = formValueSelector('notifForm')
notifForm = connect(
  state => ({
     facebooknum:selector(state, 'facebooknum'),
     notiftype:selector(state, 'notiftype'),
    initialValues:{
        desc: "Send XXX when YYY",
        sensors: [],
        attrs: [], 
        expr: "SM1>400", 
       facebooknum:'',
       
        headers: [{ key: "Content-type",  value: "application/json"}, 
                  { key: "Authorization", value: "Basic TUFNREE1WkRKSU1ETTFOWlZNWkQ6TnpSbE5XSmlObVUyTW1GallXSmxPRGhsTlRrM01Ua3laR0V6TnpJeQ=="}],
        expires: new Date("2040-05-24T20:00:00.00Z"), 
        throttling: 1, 
    }
  })
)(notifForm)
export default notifForm;

