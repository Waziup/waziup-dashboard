import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    }
  }

  componentWillReceiveProps(nextProps) {
    
    if(nextProps.errors != [] && nextProps != this.props) {
      this.setState({visible: true});
    }
  }


  handleOK = () => {
    this.setState({visible: false});
  }

  render() {
    if(this.state.visible) {
      return (
        <Container fluid={true} className="errorBanner">
        {this.props.errors.map(e => <h5>Error: Status {JSON.stringify(e.status) + " " + e.response.statusText }</h5>)}
        <RaisedButton className="errorBannerOK" label="OK" primary={true} onTouchTap={() => { this.handleOK(); }} />
        </Container>
        );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {

  var errors = [];
  if(state.sensorActionResult.error) {
    errors.push(state.sensorActionResult.msg);
  }
  if(state.sensors.error) {
    errors.push(state.sensors.msg);
  }
  return {errors: errors};
}

export default connect(mapStateToProps)(Sensors);
