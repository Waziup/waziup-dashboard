import React, {Component} from 'react';
import { Container } from 'react-grid-system'
import FullWidthSection from '../FullWidthSection'

class Profile extends Component {
  constructor(props){
    super(props);

  }
  componentWillMount(){
    console.log(this.props);
   // this.props.adminLogin();
    // this.props.updateUser(this.props.user);
  }
  render() {
    return (
      <div>
        <h1 className="page-title">Profile</h1>
        <Container>
          <FullWidthSection useContent={true}></FullWidthSection>
        </Container>
      </div>
      );
  }
}

export default Profile;

