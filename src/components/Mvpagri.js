import React, {Component} from 'react';

const kibanaURL = process.env.REACT_APP_KIBANA_URL

class MVPAgri extends Component {
  render() {
    return (
      <div>
        <h1 className="page-title">MVP Agriculture</h1>
        <iframe width='100%' height='1000px' src={kibanaUrl + "/app/kibana#/dashboard/701c1850-19f9-11e7-9de3-bf767cd7ce43?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A('%24%24hashKey'%3A'object%3A5513'%2Cdisplay%3AOff%2Cpause%3A!f%2Csection%3A0%2Cvalue%3A0)%2Ctime%3A(from%3Anow-2h%2Cmode%3Arelative%2Cto%3Anow))"}>
        </iframe>
      </div>
      );
  }
}

export default MVPAgri;

