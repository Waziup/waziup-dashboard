import React, { Component } from 'react';
import { Container} from 'react-grid-system'
import FullWidthSection from '../../FullWidthSection'
import Griddle, {RowDefinition, ColumnDefinition} from 'griddle-react';
import Spinner from 'react-spinkit';
import * as actions from '../../../actions/actions';
import Utils from '../../../utils';

class UserList extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      users : [],
      isLoading: false
    };
    actions.getUsers();
  }
  
  componentWillReceiveProps(nextProps){
    if (nextProps.users) {
      this.setState({users:nextProps.users})
    }
  }
  componentDidMount(){
  }

  render() {
    let {user} = this.props;
    return (
          <div>
            <h1 className="page-title">Users</h1>
            { this.state.isLoading ? <Spinner spinnerName="three-bounce" /> : null }
            <Container fluid={true}>
              <FullWidthSection useContent={true}>
                <Griddle resultsPerPage={10} data={this.state.users} showFilter={true} styleConfig={Utils.styleConfig()}>
                  <RowDefinition>
                    <ColumnDefinition id="id"        title="ID"/>
                    <ColumnDefinition id="username"  title="Username"/>
                    <ColumnDefinition id="firstName" title="First name"/>
                    <ColumnDefinition id="lastName"  title="Last name"/> 
                    <ColumnDefinition id="email"     title="Email"/> 
                  </RowDefinition>
                </Griddle>
              </FullWidthSection>
            </Container>
      </div>
    );
  }

}

export default UserList;
