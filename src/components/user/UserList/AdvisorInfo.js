import React, { Component } from 'react';
import { Container } from 'react-grid-system'
import Griddle, { RowDefinition, ColumnDefinition } from 'griddle-react';
import Spinner from 'react-spinkit';
import Utils from '../../../lib/utils';
import { loadUsers } from "../../../api-adapter.js"
import { connect } from 'react-redux';

class AdvisorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isLoading: true
    };
  }

  componentDidMount() {
    this.props.loadUsers(this.props.idToken.Service);
    this.filterMyAdvisorInfo(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.users)
      this.filterMyAdvisorInfo(nextProps);
  }

  filterMyAdvisorInfo(props) {
    //My farms as farmer
    const farms = Utils.getPermMap(props.idToken.permissions)['farmer'];
    
    const advisors = props.users.filter(user => {
      let advisor = Utils.getPermMap(user.attributes.permissions[0]);
      advisor = advisor['advisor'];
      let result = !!advisor && advisor.some(advisorSp =>
        farms.some(farmSp => advisorSp.toUpperCase() === farmSp.toUpperCase() ||
          farmSp.toUpperCase().startsWith(advisorSp.toUpperCase()))
      );
      return result;
    });

    //filter users based on their permissions farmer's field
    this.setState({ users: advisors })
    this.setState({ isLoading: false })
    
  }

  render() {
    return (
      <div>
        <h1 className="page-title">List of All Advisors</h1>
        {this.state.isLoading && <Spinner spinnerName="three-bounce" />}
        <Container fluid={true}>
          <div>
            <Griddle resultsPerPage={10} data={this.state.users} showFilter={true} styleConfig={Utils.styleConfig()}>
              <RowDefinition>
                <ColumnDefinition id="username" title="Username" />
                <ColumnDefinition id="firstName" title="First name" />
                <ColumnDefinition id="lastName" title="Last name" />
                <ColumnDefinition id="email" title="Email" />
                <ColumnDefinition id="attributes.Cell" title="Cell" />
                <ColumnDefinition id="attributes.Address" title="Address" />
              </RowDefinition>
            </Griddle>
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.users.users,
    idToken: state.keycloak.idTokenParsed,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadUsers: (realm) => {dispatch(loadUsers(realm)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorInfo)