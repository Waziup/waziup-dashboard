import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField'
import { Row, Col } from 'react-grid-system'
import axios from 'axios'

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userRep: {},
            isLoading: false,
            success: 1
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.findSetUser(this.props)
    }

    /*componentWillUnmount() {
        console.log('componentWillUnmount')
        this.setState({ success: 1 })
    }*/

    /*componentWillReceiveProps(nextProps) {
        this.findSetUser(nextProps)
    }*/

    findSetUser(props) {
        const user = props.users.find((el) => (el.id === props.params.uid));
        if (user) {
            this.setState({ firstname: user.firstName });
            this.setState({ lastname: user.lastName });
            this.setState({ email: user.email });
            this.setState({ cell: user.attributes.Cell });
            this.setState({ permissions: user.attributes.permissions });
            this.setState({ address: user.attributes.Address });
            this.setState({ userRep: user })
            this.setState({ isLoading: true })
        }
        else
            console.log('Could not find user');
    }

    async updateUser() {
        const userRep = this.state.userRep
        userRep.firstName = this.state.firstname
        userRep.lastName = this.state.lastname
        userRep.email = this.state.email
        userRep.attributes.Address = this.state.address
        userRep.attributes.Cell = this.state.cell
        userRep.attributes.permissions = this.state.permissions
        await axios.put('/api/v1/kcadmin/user/update/'.concat(this.props.keycloak.realm), userRep,
            {
                headers: {
                    'content-type': 'application/json'
                }
            }).then((status) => {
                console.log('Then: ', JSON.stringify(status));
                //if (status.status == 200)
                this.setState({ success: 2 });
                //else
                  //  this.setState({ success: 3 });
            }).catch((err) => {
                console.log('Catched error: ', JSON.stringify(err));
                this.setState({ success: 3 });
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    render() {
        const actions =
            [
                <FlatButton key='submit'
                    label="Submit"
                    primary={true}
                    onTouchTap={() => {
                        this.updateUser();
                    }}
                />,
                <FlatButton key='cancel'
                    label="Cancel"
                    primary={false}
                    onTouchTap={() => { }}
                />
            ];

        let successTag = <div/>;
        if (this.state.success === 2)
            successTag = <h2> User information for {this.state.userRep.firstName} {this.state.userRep.lastName} has been successfully updated. </h2>
        else if (this.state.success === 3)
            successTag = <h2> Failed to update user {this.state.userRep.firstName} {this.state.userRep.lastName}. </h2>

        const renderUserForm =
            <center>
                <h1> User Management</h1>
                {successTag}
                <form>
                    <Row>
                        <Col md={4}>
                            <TextField name="firstname"
                                defaultValue={this.state.firstname}
                                floatingLabelText="Firstname"
                                id="firstname" onChange={this.handleInputChange} />
                        </Col>
                        <Col md={4} >
                            <TextField name="lastname"
                                defaultValue={this.state.lastname}
                                floatingLabelText="Lastname"
                                id="lastname" onChange={this.handleInputChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <TextField name="email"
                                defaultValue={this.state.email}
                                floatingLabelText="email"
                                id="email" onChange={this.handleInputChange} />
                        </Col>
                        <Col md={4}>
                            <TextField name="cell"
                                defaultValue={this.state.cell}
                                floatingLabelText="Cell"
                                id="cell" onChange={this.handleInputChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <TextField name="permissions"
                                defaultValue={this.state.permissions}
                                floatingLabelText="Permissions"
                                id="permissions" onChange={this.handleInputChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <TextField name="address"
                                defaultValue={this.state.address}
                                floatingLabelText="Address"
                                id="address" onChange={this.handleInputChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            {actions}
                        </Col>
                    </Row>
                </form>
            </center>

        return (
            (this.state.isLoading === true) &&
            renderUserForm
        );
    }
}

function mapStateToProps(state) {
    return {
        users: state.users.users,
        keycloak: state.keycloak
    }
}

export default connect(mapStateToProps)(User);
