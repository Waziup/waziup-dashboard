import React, { Component } from 'react';
import { Container} from 'react-grid-system'
import FullWidthSection from '../../FullWidthSection'
import Griddle from 'griddle-react';
import Spinner from 'react-spinkit';

class UserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      users : props.users,
      isLoading:false
    };
  }
  defaultProps = {
    users: []
  };
  componentWillReceiveProps(nextProps){
    if (nextProps.users) {
      this.setState({users:nextProps.users})
    }
  }
  componentDidMount(){
  }

  tableMeta = [
    {
      "columnName": "id",
      "order": 1,
      "displayName": "ID"
    },
    {
      "columnName": "username",
      "order": 2,
      "visible": true,
      "displayName": "Username"
    },
    {
      "columnName": "firstName",
      "order": 2,
      "visible": true,
      "displayName": "Firstname"
    },
    {
      "columnName": "lastName",
      "order": 2,
      "visible": true,
      "displayName": "Lastname"
    },
    {
      "columnName": "email",
      "order": 2,
      "visible": true,
      "displayName": "Email"
    },
  ];

  render() {
    let {user} = this.props;
    return (
          <div>
            <h1 className="page-title">Users</h1>
            { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }
            <Container fluid={true}>
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={10} results={this.state.users} columnMetadata={this.tableMeta} columns={[ "username","firstName","lastName","email"]} showFilter={true} />
              </FullWidthSection>
            </Container>
      </div>
    );
  }

}

export default UserList;
