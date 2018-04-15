require('normalize.css');
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import { Container, Col, Hidden } from 'react-grid-system'
import UTIL from '../lib/utils.js';
import ErrorBanner from './ErrorBanner';
import sensorNodesImage from '../images/sensorNodes.png';
import { browserHistory } from 'react-router'
import { getPermissions } from "../actions/actions.js"

const styles = {
  medium: {
    marginRight: 30,
    color: '#cecece'
  },
  menuLink: {
    border: 'none',
  }
}

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  componentWillMount() {
    this.props.getPermissions()
    this.setState({
      muiTheme: getMuiTheme()
    });
  }

  render() {
    var Logo;
    Logo = require("../images/logo-waziup-white.png");
    const profileButton = 
      <IconButton className="profile-menu" style={styles.medium}>
        <span className="user-name">{this.props.user.firstName + " " + this.props.user.lastName}</span>
        <AccountCircle />
      </IconButton>

    const headerMenu =
      <IconMenu iconButtonElement={profileButton} anchorOrigin={{ horizontal: 'left', vertical: 'top' }} targetOrigin={{ horizontal: 'left', vertical: 'top' }}>
        <MenuItem primaryText="Help" href='http://www.waziup.io/documentation' />
        <MenuItem primaryText="Profile" onClick={() => { browserHistory.push('/users/' + this.props.user.id) }} />
        <MenuItem primaryText="Sign Out" onClick={() => { this.props.keycloak.logout() }} />
      </IconMenu>

    return (
      <div id="main">
        <AppBar
          title={<img style={styles.logo} src={Logo} alt="logo" onClick={() => { browserHistory.push('/') }}/>}
          onLeftIconButtonTouchTap={this.toggleNavigation}
          iconElementRight={headerMenu}
          className="navbar"
        />
        <Hidden xs sm>
          <Col md={2} className="page-sidebar sidebar">
            <div className="page-sidebar-inner">
              <div className="menu">
                <MenuItem containerElement={<Link to="/sensors" />}
                          innerDivStyle={styles.menuLink}
                          primaryText="Sensors"/>
                <MenuItem containerElement={<Link to="/gateways" />}
                          innerDivStyle={styles.menuLink}
                          primaryText="Gateways"/>
                <MenuItem containerElement={<Link to="/notifications" />}
                          innerDivStyle={styles.menuLink}
                          primaryText="Notifications"/>
                <MenuItem containerElement={<Link to="/map" />}
                          primaryText="Map" innerDivStyle={styles.menuLink}/>
                {this.props.permissions.find(p => p.resource == 'Users' && p.scopes.includes('users:view'))?
                  <MenuItem containerElement={<Link to="/users" />} primaryText="Users" innerDivStyle={styles.menuLink}/>:null}
              </div>
            </div>
          </Col>
        </Hidden>
        <Col md={10} className="page-inner">
          <div id="main-wrapper">
            <ErrorBanner/>
            {this.props.children}
          </div>
          <div className="page-footer">
            <Container>
              <Col md={6} className="footer-left">
                <p className="text">Code licensed under <a type="application/rss+xml" href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2</a> © 2017 <a href="">Waziup.io</a></p>
              </Col>
            </Container>
          </div>
        </Col>
      </div>
    );
  }
}

Layout.childContextTypes = {
  muiTheme: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    keycloak: state.keycloak,
    permissions: state.permissions.permissions
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getPermissions: () => {dispatch(getPermissions()) }, 
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
