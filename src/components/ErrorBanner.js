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

    function getLine(e) {
      if(e.error) {
        return <h4 style={{"color": "red"}}> {e.msg} </h4>
      } else {
        return <h4 style={{"color": "green"}}> {e.msg} </h4>
      }
    }
    console.log("props: " + JSON.stringify(this.props))
    if(this.props.messages.length !=0) {
      return (
        <Container fluid={true} className="errorBanner" >
          {this.props.messages.map(e => getLine(e))}
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
