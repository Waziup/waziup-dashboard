import React, {Component} from 'react';
import { reduxForm, Field,FieldArray } from 'redux-form'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import UTIL from '../../../lib/utils.js';
import MenuItem from 'material-ui/MenuItem'
import { SelectField, TextField } from 'redux-form-material-ui'
import { Row, Col } from 'react-grid-system'

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
    console.log("notif form props " + JSON.stringify(nextProps));
  }

  render() {
    const {reset, modalOpen, handleClose, onSubmit, sensors} = this.props;
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
        return !pos || item !== array[pos - 1];
    })
}
    return (
        <Dialog
              title="Create New Notification"
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
                <Field name="phone"
                  component={TextField}
                  fullWidth={true}
                  hintText="Phone number"
                  floatingLabelText="Phone number"
                  ref="phone" withRef>
                </Field>
              </Row>
              <Row>
                <Field name="message"
                  component={TextField}
                  fullWidth={true}
                  hintText="message"
                  floatingLabelText="Message"
                  ref="message" withRef>
                </Field>
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
                <Field name="expires"
                  component={DatePicker}
                  hintText="Expires"
                  floatingLabelText="Expires"
                  ref="expires" withRef>
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

notifForm = connect(
  state => ({
    initialValues:{
        desc: "Send text message",
        sensors: [],
        attrs: [],
        expr: "SM1>400",
        phone: "+36000000000",
        message: "WaterSense: Field is too dry. ${id} humidity value is ${SM1}",
        expires: new Date("2040-05-24T20:00:00.00Z"), 
        throttling: 1, 
    }
  }))(notifForm)

export default notifForm;

