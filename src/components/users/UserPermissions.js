import React, { Component } from 'react';
import { connect } from 'react-redux';
//import { Container } from 'react-grid-system'
import UTIL from '../../lib/utils.js';

class UserPermissions extends Component {
    /*async componentWillMount() {
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
    }*/

    render() {
        const permissions = this.props.permissions;
        const permissionsMap = UTIL.getPermMap(permissions);

        return (
            <center>
                <h1> User Roles and Permissions </h1>
                {
                    UTIL.isAdmin(permissions) && <p> You are admin. </p>}
                {
                    UTIL.isAdvisor(permissions) ? <p> You are advisor of {permissionsMap.advisor.map(f => f)} </p> : ''}
                {
                    UTIL.isFarmer(permissions) ? <p> You are farmer of {permissionsMap.farmer.map(f => f.concat(' '))} </p> : ''
                }
            </center>
        )
    }
}

function mapStateToProps(state) {
    return {
        permissions: state.keycloak.idTokenParsed.permissions
    };
}

export default connect(mapStateToProps)(UserPermissions);