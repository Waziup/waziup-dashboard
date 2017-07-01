import React, { Component } from 'react';
import axios from 'axios';
//import { Container } from 'react-grid-system'

class UserPermissions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions:{}
        };
    }

    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }

    async componentWillMount() {
        const res = await axios.get('/api/v1/authorization/permissions');
        const permissions = res.permissions;
        await this.setStateAsync({ permissions });
        console.log('state', this.state.permissions)
        console.log('permissions', permissions)
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
                permission => 
                     (<g><p> permission.key: </p>  <p> permission.value.map(entity => entity) </p></g>)
     */

    render() {
        return (            
            <p>{JSON.stringify(this.state.permissions)}</p>
            )
        
    }
}

export default UserPermissions;