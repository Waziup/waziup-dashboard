import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Form, ControlLabel, FormControl, Button} from 'react-bootstrap';
//import moment from 'moment-timezone';
//Alert, Panel, Well, ListGroupItem, ListGroup,

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

    dispatch(this.props.action(this.state.orionService, this.state.orionServicePath))
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
    console.log(this.state.orionService)
    event.preventDefault(); 
  }

  render() {
    return <Form inline onSubmit={this.handleSubmit}>
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
      <Button type="submit">
        Query {this.props.actionName} For { this.state.orionService}:{this.state.orionServicePath} 
      </Button>
    </Form>
  }
}

//export default OrionParamForm;
// const mapStateToProps = state => {
//   return {subscriptions: state.subscriptions}
// }

export default connect()(OrionParamForm)