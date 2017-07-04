import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

//import { Container } from 'react-grid-system'

class UserPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: {}
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentWillMount() {
        //console.log('accessToken', this.props.accessToken)
        const res = await axios.get('/api/v1/authorization/permissions', 
                        {
                            headers: {
                               'Authorization': 'Bearer '.concat(this.props.accessToken)
                            }
                        });
        const permissions = res.data.permissions;
        await this.setStateAsync({ permissions });
        console.log('this.state.permissions', this.state.permissions);
        console.log('res ', res);
    }

    /*
    {
     admin: [],
     advisor: [ '/FARM1', '/FARM2' ],
     farmer: [ '/FARM2' ]
    } => (role, entities)
     */

    /* a library
     isAdmin
     canManageUsers
     canDefineFarmers
    this.state.permissions.map( 
                permission => (<g><p> {permission.key}: </p>  <p> {permission.value.map(entity => entity)} </p></g>))
     */
    
    render() {
        function isAdmin(permissions) {
            return permissions.hasOwnProperty('admin')
        }

        function isAdvisor(permissions) {
            return permissions.hasOwnProperty('advisor')
        }

        function isFarmer(permissions) {
            return permissions.hasOwnProperty('farmer')
        }

        //JSON.stringify(permissions)
        const permissions = this.state.permissions;

        
        return (            
            <p>
            Permission: 
            {
            isAdmin(permissions)? <p> is admin. </p>: ''}
            {
            isAdvisor(permissions)? <p> is advisor of {permissions.advisor.map(f => f)} </p>: ''}
            {
            isFarmer(permissions)? <p> is advisor of {permissions.farmer.map(f => f)} </p>: ''
            }            
            </p>
            )
    }
}

function mapStateToProps(state) {
  return {
      accessToken: state.keycloak.token,
  };
}

export default connect(mapStateToProps)(UserPermissions);