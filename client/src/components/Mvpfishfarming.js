import React, {Component} from 'react';

const kibanaURL = process.env.REACT_APP_KIBANA_URL

class MVPFishFarming extends Component {
  render() {
    return (
      <div>
        <h1 className="page-title">MVP Fish Farming</h1>
            <iframe width='100%' height='1000px' src={kibanaURL + "/app/kibana#/dashboard/747bd6c0-1458-11e7-bf1e-cdcaa5996beb?embed=true&_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow-7d%2Cmode%3Aquick%2Cto%3Anow))"} > 
            </iframe>
      </div>
      );
  }
}

export default MVPFishFarming;

