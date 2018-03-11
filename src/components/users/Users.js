import React, { Component } from 'react';
import { Container } from 'react-grid-system'
import { connect } from 'react-redux';
import { getUsers, deleteUser } from '../../actions/actions';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const rowDataSelector = (state, { griddleKey }) => {
      return state
        .get('data')
        .find(rowMap => rowMap.get('griddleKey') === griddleKey)
        .delete('griddleKey')
        .toJSON();
    };

    const enhancedWithRowData = connect((state, props) => {
      return {
        // rowData will be available into RowActions
        rowData: rowDataSelector(state, props),
        deleteAction: this.handleUserDelete,
        manageAction: this.handleUserManage
      };
    });

    return (
      <div>
        <h1 className="page-title">List of All Users</h1>
        <Container fluid={true}>
          <div>
            {(this.props.users.isLoading === false) ?
              this.props.users.error === false ?
                <Griddle resultsPerPage={30} data={this.props.users.users} showFilter={true} plugins={[plugins.LocalPlugin]} styleConfig={Utils.styleConfig()}>
                  <RowDefinition>
                    <ColumnDefinition id="username" title="Username" />
                    <ColumnDefinition id="firstName" title="First name" />
                    <ColumnDefinition id="lastName" title="Last name" />
                    <ColumnDefinition id="email" title="Email" />
                    <ColumnDefinition id="attributes.Cell" title="Cell" />
                    <ColumnDefinition id="attributes.Address" title="Address" />
                    <ColumnDefinition id="attributes.permissions" title="Permissions" />
                    <ColumnDefinition id="actions" title="Manage" customComponent={enhancedWithRowData(UserActions)} />
                  </RowDefinition>
                </Griddle> :
                <h2> Some error happened during loading the list of users. </h2>
              :
              <h2> The list of users is being loaded. </h2>
            }
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      users: state.users,
      keycloak: state.keycloak
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
       getUsers: () => {dispatch(getUsers()) },
       deleteUser: (id) => {dispatch(deleteUser(id)) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Users)
