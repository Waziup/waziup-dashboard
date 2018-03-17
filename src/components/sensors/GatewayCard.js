import React, { Component } from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import PropTypes from 'prop-types';
import gatewayImage from '../../images/RPI.png';
import config from '../../config';
import * as Waziup from 'waziup-js'

export default class GatewayCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return ( 
      <Card className="sensorNode">
        <CardTitle>
          <h2 className="cardTitle"> Gateway {this.props.gatewayID} </h2>
        </CardTitle>
        <div className="contentCards">
          <div className="boardIcon">
            <img src={gatewayImage} height="120"/>
          </div>
          <div className="sensorNodes">
            {this.props.children}
          </div>
        </div>
      </Card>
    );
  }

  propTypes = {
    gatewayID: PropTypes.string.isRequired
  }
}
