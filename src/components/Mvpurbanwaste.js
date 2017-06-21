import React, {Component} from 'react';

const kibanaURL = process.env.REACT_APP_KIBANA_URL

class MVPUrbanWaste extends Component {
  render() {
    return (
      <div>
        <h1 className="page-title">MVP Urban Waste</h1>
           <iframe width='100%' height='1000px' src={kibanaURL + "/app/kibana#/dashboard/b01da890-19dd-11e7-8d9e-f18be4af068e?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A('%24%24hashKey'%3A'object%3A5513'%2Cdisplay%3AOff%2Cpause%3A!f%2Csection%3A0%2Cvalue%3A0)%2Ctime%3A(from%3Anow-2h%2Cmode%3Arelative%2Cto%3Anow))"}>
           </iframe>
      </div>
      );
  }
}
export default MVPUrbanWaste;

