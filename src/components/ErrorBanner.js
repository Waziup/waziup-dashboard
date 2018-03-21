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

    var messages = this.props.messages.reduce(function(acc, m){
      let index = acc.findIndex(a => a.msg == m.msg)
      if (index>=0) {
        acc[index].count++
      } else {
        acc=[...acc, {...m, count: 1}];
      }
      return acc;
    }, []);

    function getLine(e) {
      if(e.error) {
        return <h4 style={{"color": "red"}}> {e.msg + " [" + e.count + "]"} </h4>
      } else {
        return <h4 style={{"color": "green"}}> {e.msg + " [" + e.count + "]"} </h4>
      }
    }
    console.log("props: " + JSON.stringify(this.props))
    if(this.props.messages.length !=0) {
      return (
        <Container fluid={true} className="errorBanner" >
          {messages.map(a => getLine(a))}
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
