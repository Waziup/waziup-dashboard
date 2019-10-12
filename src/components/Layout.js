require('normalize.css');
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { Link } from 'react-router';
import IconButton from '@material-ui/core/IconButton';

import Button from '@material-ui/core/Button';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import AccountCircle from '@material-ui/icons/AccountCircle';
import ErrorBanner from './ErrorBanner';
import { browserHistory } from 'react-router'
import { getDevicePermissions, getProjectPermissions, getGatewayPermissions, logout } from "../actions/actions.js"
import config from '../config';
import { Container, Col } from 'react-grid-system'
import Grid from '@material-ui/core/Grid';

import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import MenuIcon from '@material-ui/icons/Menu';
import PlaceIcon from '@material-ui/icons/Place';
import CloudIcon from '@material-ui/icons/Cloud';
import AlarmIcon from '@material-ui/icons/Alarm';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsRemoteIcon from '@material-ui/icons/SettingsRemote';

import theme from './theme';

const drawerWidth = 240;

const styles = () => ({
  root: {
    display: 'flex',
  },
  drawer: {   
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  grow: {
    flexGrow: 1,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    maxHeight: '64px'
  },
  appBar: {
    marginLeft: drawerWidth,
    backgroundColor: '#ffffff !important',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  sideBarMenuItem: {
    color: '#ffffff',
    textColor: '#ffffff !important',
    backgroundColor: '#ffffff !important'
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    backgroundColor: "#34425A",
    width: drawerWidth,
  },
  button: {
    margin: theme.spacing.unit,
    textTransform: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    backgroundColor: '#fafafa'
  },
  logo: {
    width: drawerWidth,
    padding: '20px',
  },
  medium: {
    marginRight: 30,
    color: '#cecece'
  },
  menuLink: {
    border: 'none',
  },
  listItemText: {
    color: '#fff',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      collapseOpen: false,
      anchorEl: null
    };
  }

  componentWillMount() {
    this.props.getDevicePermissions();
    this.props.getProjectPermissions();
    this.props.getGatewayPermissions();
  }
  
  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCollapse = () => {
    this.setState(state => ({ collapseOpen: !state.collapseOpen }));
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  hideDrawer = () => {
    if(this.state.mobileOpen)
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;
    const open = Boolean(anchorEl);
    const Logo = require("../images/logo-waziup-white.png");
    const listItems = [
      { name: "Projects", icon: (<AssignmentIcon />)},
      { name: "Devices", icon: (<SettingsRemoteIcon />)},
      { name: "Gateways", icon: (<CloudIcon />)},
      { name: "Notifications", icon: (<AlarmIcon />)}
    ]

      const renderMenu = (
        <div>
          <Button      
            className={classes.button}            
            aria-owns={open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
            color="inherit">
              {this.props.user ? (this.props.user.firstName + " " + this.props.user.lastName + " ") : ""}
              <AccountCircle className={classes.rightIcon}/>
            </Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={this.handleClose}
          >
            <MenuItem component="a" href="http://www.waziup.io/documentation"> Help</MenuItem>
            <MenuItem component="a" href={config.keycloakUrl + '/realms/' + config.realm + '/account?referrer=Dashboard&referrer_uri=' + config.serverUrl}>Profile</MenuItem>
            <MenuItem component={Link} to={"/Settings"}>Settings</MenuItem>
            <MenuItem onClick={() => { this.props.logout(); this.props.keycloak.logout() }}>Sign Out</MenuItem>
          </Menu>
        </div>
      );

      const drawer = (
        <div>
          <div className={classes.drawerHeader}>
          <img style={styles.logo} src={Logo} className={classes.logo} alt="logo" onClick={() => { browserHistory.push('/') }}/>
          </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

          <Divider />

          <List>
            {listItems.map((text, index) => (
              <ListItem button  key={index} component={Link} to={"/" + text.name} onTouchTap={this.hideDrawer} >   
                <ListItemIcon><span className={classes.listItemText}>{ text.icon }</span></ListItemIcon>
                <ListItemText><span className={classes.listItemText}>{ text.name }</span></ListItemText>                                                    
              </ListItem>
            ))}
          </List>
        </div>
      );


    return (
      <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              aria-label="Open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.grow} />
            { renderMenu }
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer}>
          {/* The implementation can be swap with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              container={this.props.container}
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
             {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
           <div id="main-wrapper">
     <ErrorBanner/>
     <Grid container spacing={24}>
      <Grid item xs={12}>  
        {this.props.children}
      </Grid>
     </Grid>
   </div>
   <div className="page-footer">
   <Container>
       <Col md={6} className="footer-left">
         <p className="text">Code licensed under <a type="application/rss+xml" href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2</a> © 2017 <a href="">Waziup.io</a></p>
       </Col>
       </Container>
   </div>
        </main>
      </div>
      </MuiThemeProvider>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    user: state.current_user,
    keycloak: state.keycloak,
    permissions: state.permissions.device
  };
}

const mapDispatchToProps = {
  getDevicePermissions,
  getProjectPermissions,
  getGatewayPermissions,
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Layout));
