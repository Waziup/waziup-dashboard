import React, {Component} from 'react';
import config from '../../../config';
import PropTypes from 'prop-types';
import helpImage from '../../images/gateway_install.png';

export default class GatewaysHelp extends Component {

  constructor(props){
    super(props);
    this.state = { 
      show: false
    }
  }

  render() {
    return (
      <div style={{"margin-left":"auto"}}>
      <img src={helpImage} height="50" onClick={() => this.setState({show: true})}/>
      {this.state.show ?
        <div className='help'>
          <span className="close" onClick={() => this.setState({show: false})}>&times;</span>
          <span>
            <h1> How to install your gateway?</h1>
            Download the ISO from here:
            <a href=> Lastest ISO image </a>
          </span>
        </div>
      :null}
    </div>
    )
  }
}

GatewaysHelp.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
