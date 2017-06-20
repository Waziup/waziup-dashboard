import React, {Component} from 'react';
import { Container } from 'react-grid-system'

class Profile extends Component {
  
  componentWillMount(){
    console.log(this.props);
  }

  render() {
    return (
      <div>
        <h1 className="page-title">Profile</h1>
        <Container>
        </Container>
      </div>
      );
  }
}

export default Profile;

