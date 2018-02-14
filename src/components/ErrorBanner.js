import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system'
import RaisedButton from 'material-ui/RaisedButton';
import { clearMessages } from "../actions/actions.js"

class Sensors extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  handleOK = () => {
    this.props.clearMessages(); 
  }

  render() {
    console.log("props: " + JSON.stringify(this.props))
    if(this.props.messages.length !=0) {
      return (
        <Container fluid={true} className="errorBanner" >
          {Array.isArray(this.props.messages) ? this.props.messages.map(e => <h5> {e.msg}</h5>): null}
          <RaisedButton className="errorBannerOK" label="OK" primary={true} onTouchTap={() => { this.handleOK(); }} />
        </Container>
        );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {messages: state.messages};
}

function mapDispatchToProps(dispatch) {
  return {
    clearMessages: () => { dispatch(clearMessages()) },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Sensors);
