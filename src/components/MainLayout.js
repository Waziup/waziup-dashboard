import React, { Component } from 'react'

import { PageHeader, Grid, Row, Col, Nav, NavItem, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router'
//import { Button } from 'react-bootstrap';, ButtonToolbar, Navbar
//import SideBarMenu from './SideBarMenu'


class MainLayout extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        //this.handleSensingDevicesComponent = this.handleSensingDevicesComponent.bind(this)
    }

    // handleSensingDevicesComponent = e => {
    //     e.preventDefault()
    //     //const { dispatch } = this.props
    //     //dispatch(fetchDevicesList())
    //     //this.setState({ showSensingDevicesComponent: !this.state.showSensingDevicesComponent });
    // }onClick={this.handleSensingDevicesComponent}
    //circle-arrow-left
    render() {
        return (
            <div>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css" />
                <Grid fluid={true}>
                    <Row className="show-grid">
                        <Col lg={12} md={12} xs={12}>
                            <PageHeader>WaterSense Dashboard <small> </small></PageHeader>
                        </Col>
                    </Row>
                    <Col lg={2} md={2} xs={2} className="side-bar">
                        <Nav bsStyle="pills" stacked>
                            <NavItem eventKey={3} title="Home"> <Glyphicon glyph="home" /> <Link activeClassName="active" to="/home">Home</Link></NavItem>
                            <NavItem eventKey={2} title="Sensing Devices"><Glyphicon glyph="object-align-vertical" /> <Link activeClassName="active" to="/sensingdevices">Sensing Devices</Link></NavItem>
                            <NavItem eventKey={2} title="Subscriptions"><Glyphicon glyph="wrench" /> <Link activeClassName="active" to="/subscriptions">Subscriptions</Link></NavItem>
                            <NavItem eventKey={1} title="User Info"><Glyphicon glyph="user" /> <Link activeClassName="active" to="/userinfo">User Information & Tokens</Link></NavItem>
                            <NavItem eventKey={2} title="Account Management"><Glyphicon glyph="user" /> <Link activeClassName="active" to="/accountmngmnt">Account Management</Link></NavItem>
                            <NavItem eventKey={3} title="Logout"><Glyphicon glyph="log-out" /> <Link activeClassName="active" to="/logout">Logout</Link></NavItem>                            
                        </Nav>
                    </Col>
                    <Col lg={10} md={10} xs={10}>
                        {this.props.children}
                    </Col>
                </Grid>
            </div>
        )
    }
}

export default MainLayout