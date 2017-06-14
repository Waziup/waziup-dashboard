import React, {Component} from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { Container, Row, Col, Visible, Hidden, ScreenClassRender } from 'react-grid-system'
import Page from '../App'

class MVPFishFarming extends Component {
  render() {
    return (
      <div>
        <h1 className="page-title">MVP Fish Farming</h1>
            <iframe width='100%' height='1000px' src="http://kibana.waziup.io/app/kibana#/dashboard/747bd6c0-1458-11e7-bf1e-cdcaa5996beb?embed=true&_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-7d%2Cmode%3Aquick%2Cto%3Anow))" > 
            </iframe>
      </div>
      );
  }
}

export default MVPFishFarming;

