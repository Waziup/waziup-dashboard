import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import Security from '../lib/Security.js';
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
        const res = await axios.get('/api/v1/authorization/permissions',
            {
                headers: {
                    'Authorization': 'Bearer '.concat(this.props.accessToken)
                }
            });
        const permissions = res.data.permissions;
        await this.setStateAsync({ permissions });

        let security = new Security();
        await security.getPermissions(this.props.accessToken);
        console.log('perm:', security.state.permissions);
    }

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

        const permissions = this.state.permissions;

        return (
            <center>
                <h1> User Roles and Permissions </h1>
                {
                    isAdmin(permissions) ? <p> is admin. </p> : ''}
                {
                    isAdvisor(permissions) ? <p> is advisor of {permissions.advisor.map(f => f)} </p> : ''}
                {
                    isFarmer(permissions) ? <p> is farmer of {permissions.farmer.map(f => f)} </p> : ''
                }
            </center>
        )
    }
}

function mapStateToProps(state) {
    return {
        accessToken: state.keycloak.token,
    };
}

export default connect(mapStateToProps)(UserPermissions);