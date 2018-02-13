import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      previousError: undefined
    }
  }

  componentWillReceiveProps(nextProps) {
    
    this.setState({previousProps: this.props});
    if(nextProps.sensorActionResult.error &&  nextProps != this.props) {
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
      {this.props.sensorActionResult.error? <h5>Error: Status {JSON.stringify(this.props.sensorActionResult.msg.status) + " " + this.props.sensorActionResult.msg.response.statusText }</h5> : <br/>}
      <RaisedButton className="errorBannerOK" label="OK" primary={true} onTouchTap={() => { this.handleOK(); }} />
      </Container>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    sensorActionResult: state.sensorActionResult,
  };
}

export default connect(mapStateToProps)(Sensors);
