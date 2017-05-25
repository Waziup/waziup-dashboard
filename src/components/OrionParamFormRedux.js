import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form';
import { FormGroup, Form, ControlLabel, FormControl, Button} from 'react-bootstrap';
//import moment from 'moment-timezone';
//Alert, Panel, Well, ListGroupItem, ListGroup,

class OrionParamForm extends Component {
  constructor(props) {  
    super(props);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    // handleSubmit, 
    const { dispatch, form } = this.props
    
    let sp = form.orionParamForm.orionServicePath;
    console.log('form.orionParamForm', JSON.stringify(form.orionParamForm))
    if(sp === '/')
      sp += '#'
    dispatch(this.props.action(form.orionParamForm.orionService, sp))
    e.preventDefault(); 
  }

  render() {
    const {pristine, reset, submitting } = this.props;
//{this.props.actionName} For { this.state.orionService}:{this.state.orionServicePath}
    return <form onSubmit={this.handleSubmit}>
        <label htmlFor="service">Service</label>
        {' '}
        <Field name="orionService" component="input" type="text" />
      {' '}
        <label htmlFor="servicePath">Service Path</label>
        {' '}
        <Field name="orionServicePath" component="input" type="text" />
      {' '}
      <button type="submit" disabled={pristine || submitting}>
        Query 
      </button>
      <button type="button" disabled={pristine || submitting} onClick={reset}>
          Reset
      </button>
    </form>
  }
}

// Decorate the form component
OrionParamForm = reduxForm({
  form: 'orionParamForm', // a unique name for this form
  destroyOnUnmount: false,
  enableReinitialize : true
})(OrionParamForm);

export default connect()(OrionParamForm)