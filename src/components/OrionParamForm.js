import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Form, ControlLabel, FormControl, Button} from 'react-bootstrap';

class OrionParamForm extends Component {
  constructor(props) {  
    super(props);
    this.state = {
      orionService: this.props.orionService,
      orionServicePath: this.props.orionServicePath
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    const { dispatch } = this.props
    let sp = this.state.orionServicePath;
    if(sp === '/')
      sp += '#'
    dispatch(this.props.action(this.state.orionService, sp))
    event.preventDefault();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value // //target.type === 'checkbox' ? target.checked : target.value;
    const name = target.id;
    //console.log(name)
    //alert('Your favorite flavor is: ' + this.state.orionServicePath);

    this.setState({
      [name]: value
    });
    //console.log(this.state.orionService)
    event.preventDefault(); 
  }

  render() {
    const {pristine, submitting } = this.props;
    return <Form inline>
      <FormGroup controlId="orionService">
        <ControlLabel>Service</ControlLabel>
        {' '}
        <FormControl name="orionService" type="text" value={this.state.orionService} onChange={this.handleInputChange} placeholder="waziup" />
      </FormGroup>
      {' '}
      <FormGroup controlId="orionServicePath">
        <ControlLabel>Service</ControlLabel>
        {' '}
        <FormControl name="orionServicePath" type="text" value={this.state.orionServicePath} onChange={this.handleInputChange} placeholder="/FARM1" />
      </FormGroup>
      {' '}
      <Button type="submit" disabled={pristine || submitting} onClick={this.handleSubmit}>
        Query {this.props.actionName} For { this.state.orionService}:{this.state.orionServicePath} 
      </Button>
    </Form>
  }
}

export default connect()(OrionParamForm)