import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-grid-system'
import Button from '@material-ui/core/Button';
import { clearMessages } from "../actions/actions.js"
import Grid from '@material-ui/core/Grid';

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

    function getLine(e,index) {
      if(e.error) {
        return <h4 key={index} style={{"color": "red"}}> {e.msg + (e.count>1? " [" + e.count + "]": "")} </h4>
      } else {
        return <h4 key={index} style={{"color": "green"}}> {e.msg + (e.count>1? " [" + e.count + "]": "")} </h4>
      }
    }
    if(this.props.messages.length !=0) {
      return (
        <Container fluid={true} className="errorBanner" >
        <Grid
          container
          justify="space-between"
          alignItems="flex-start"
        >
        <div>
        {messages.map((a,index) => getLine(a,index))}
        </div>
        
          <Button  className="errorBannerOK" variant="contained" color="primary" onTouchTap={() => { this.handleOK(); }}>Clear</Button>
        </Grid>

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
