import React, { Component } from 'react';
import { Field,FieldArray,reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField'
import {RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Checkbox from 'material-ui/Checkbox'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

class SubmitNotificationForm extends Component {

  constructor(props){
    super(props);
    this.state = {
      notifications : props.notifications,
    };
  }


  componentWillReceiveProps(nextProps){
    
    if (nextProps.currentUser !== this.props.currentUser){
      this.props.fetchNotifications(nextProps.currentUser.attributes.Service[0], nextProps.currentUser.attributes.ServicePath[0]);
    }
  }

  render(){
    const customContentStyle = {
      width: '60%',
      maxWidth: 'none',
    };
    const {pristine,reset,submitting,modalShowing,handleClose,onSubmit,modalOpen,handleSubmit} = this.props    
    //List of actions of the form
    const actions = [
      <RaisedButton
        label="Submit"
        primary={true}
        onTouchTap={()=>{
          this.props.submit();          
          handleClose();
        }}
      />,
      <RaisedButton
        label="Cancel"
        secondary={true}
        onTouchTap={handleClose}
      />,      
    ];
    //Constant of usernames
    const usernames = ['constantin','corentin'];
    let renderTextField = ({input, label, meta : {touched, error},...custom})=>(<TextField hinText={label} floatingLabelText={label} errorText={touched && error} {...input}{...custom} /> );
    let renderCheckbox  = ({input, label}) =>(<Checkbox label={label} checked={input.value ? true : false} onCheck={input.onChange}/>);
    let renderSelectField = ({ input, label, meta: { touched, error }, children, ...custom }) => 
    (<SelectField  floatingLabelText={label} 
                   errorText={touched && error}
                   {...input} 
                   onChange={(event, index, value) => input.onChange(value)} 
                   children={children} 
                   {...custom}/>);
    let renderRadioGroup = ({ input, ...rest }) => (<RadioButtonGroup {...input} {...rest} valueSelected={input.value} onChange={(event, value) => input.onChange(value)}/>);
    let renderMembers = ({ fields, meta: { touched, error, submitFailed } }) => (  
    <ul>    
    <li>
      <RaisedButton label="Add channel"  primary={true} onClick={() => fields.push({})}/>
      {(touched || submitFailed) && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) =>
      <li key={index}>      
       <table>  
        <tr>
          <td>
            <Field
              name={`${member}.channel`}
              component={renderSelectField}
              label={`Channel ${index}`}>
              <MenuItem value='facebook' primaryText='Facebook'/>
              <MenuItem value='twitter' primaryText='Tweeter'/>
              <MenuItem value='viber' primaryText='Viber'/>
            </Field>
            </td>
            <td>
            <Field
              name={`${member}.profile`}
              type="text"
              component={renderTextField}
              label="Profile"
            />
            </td>
            <td>
           <RaisedButton
            label="Remove"
            secondary={true}
            onClick={() => fields.remove(index)}/>
            </td>
         </tr>
        </table>
      </li>
    )}
  </ul>
);
const renderSensors = ({ fields, meta: { touched, error, submitFailed } }) => (  
    <ul>    
    <li>
      <RaisedButton label="Add sensor threshold" name="addsensor"  primary={true} onClick={() => fields.push({})}/>
      {(touched || submitFailed) && error && <span>{error}</span>}
    </li>
    {fields.map((member, index) =>
      <li key={index}> 
      <table>
       <tr>
        <td>
        <Field
          name={`${member}.sensorvalue`}
          component={renderSelectField}
          label={`Sensor value ${index}`}>
          <MenuItem value={'temperature'} primaryText='Temperature'/>
          <MenuItem value={'pressure'} primaryText='Pressure'/>
          <MenuItem value={'humidity'} primaryText='Humidity'/>
        </Field>  
        </td>   
        <td>
        <Field
           name={`${member}.treshordvalue`}
          type="text"
          component={renderTextField}
          label="Threshold"/>  
       </td>
       <td>   
       <Field
          name={`${member}.filter`}
          component={renderSelectField}
          label="Filter">
          <MenuItem value={'equal'} primaryText='Equal'/>
          <MenuItem value={'inferior'} primaryText='Inferior'/>
          <MenuItem value={'superior'} primaryText='Superior'/>
       </Field>   
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
    <Dialog title="Create notifications" modal={true} 
                                         open={modalOpen}  
                                         autoScrollBodyContent={true} 
                                         actions={actions} 
                                         autoScrollBodyContent={true}
                                         modal={false}
                                         autoDetectWindowHeight={true}
                                         contentStyle={customContentStyle}>
      <form onSubmit={handleSubmit}>
        <div>        
        <Field label="Username" name="usernamenotification" component={renderSelectField}>
          <MenuItem value={'Constantin'} primaryText="Constantin"/>
          <MenuItem value={'Corentin'}  primaryText="Corentin"/>
        </Field>
        </div>
        <FieldArray name="members" component={renderMembers}/> 
        <Field label="Sensor" name="sensor" component={renderSelectField}>
          <MenuItem value={'Sensor1'} primaryText="Sensor 1"/>
          <MenuItem value={'Sensor2'} primaryText="Sensor 2"/>
        </Field>
        <FieldArray name="sensors" component={renderSensors}/> 
        <Field label="Notification message" name="notificationmessage" type="text" component={renderTextField}/>
    </form>
    </Dialog>)}
}

SubmitNotificationForm  = reduxForm(
 {form : 'SubmitNotificationForm'}
)(SubmitNotificationForm);

export default SubmitNotificationForm ;
