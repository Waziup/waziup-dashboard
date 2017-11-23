import axios from 'axios';

class Security {
    constructor() {
        this.state = {
            permissions: {}
        };
    }

    setState = (params) => this.state = Object.assign({}, this.state, params);
    isAdmin = ()  => (this.state.permissions.hasOwnProperty('admin'))

    async getPermissions(accessToken) {
        const res = await axios.get('/api/v1/authorization/permissions', 
                        {
                            headers: {
                               'Authorization': 'Bearer '.concat(accessToken),
                            }
                        });
        const permissions = res.data.permissions;
        this.setState({ permissions });
        return this.state.permissions;
    }


    isAdvisor() {
        return this.state.permissions.hasOwnProperty('advisor')
    }

    isFarmer() {
        return this.state.permissions.hasOwnProperty('farmer')
    }        
}

export default Security;