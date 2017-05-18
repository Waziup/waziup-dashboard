import React, { Component } from 'react'
import styles from './sideBarMenu.css';
import {Nav, NavItem, Navbar, NavDropdown, MenuItem, Glyphicon} from 'react-bootstrap';

class SideBarMenu extends Component { 
    render() {
        return <div id="sidebar-menu" className={styles.sideBarMenuContainer}>
            <Navbar fluid className={styles.sidebar} inverse >
                <Navbar.Header>
                    <Navbar.Brand>
                        <a href="/">User Name</a>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Text className={styles.userMenu}>
                        <Navbar.Link href="#"><Glyphicon glyph="home"/></Navbar.Link>
                        <Navbar.Link href="#"><Glyphicon glyph="log-out"/></Navbar.Link>
                    </Navbar.Text>
                    <Nav>
                        <NavDropdown eventKey={1} title="Item 1">
                            <MenuItem eventKey={1.1} href="#">Item 1.1</MenuItem>
                        </NavDropdown>
                        <NavItem eventKey={2}>Item 2</NavItem>
                        <NavItem eventKey={3}>Item 3</NavItem>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    }
}

 <ButtonToolbar>
                        {/* Provides extra visual weight and identifies the primary action in a set of buttons */}
                        <Button bsStyle="primary">
                            
                        </Button> <br/>
                        {/* Indicates a successful or positive action */}
                        <Button bsStyle="success">
                            
                        </Button>
                        {/* Standard button */}
                        <Button>
                        </Button>
                        {/* Contextual button for informational alert messages */}
                        <Button bsStyle="info">Info</Button>
                        {/* Indicates caution should be taken with this action */}
                        <Button bsStyle="warning" >Warning</Button>
                        {/* Indicates a dangerous or potentially negative action */}
                        <Button bsStyle="danger" disabled >Danger</Button>
                        {/* Deemphasize a button by making it look like a link while maintaining button behavior */}
                        <Button bsStyle="link" disabled>Link</Button>
                    </ButtonToolbar>
export default SideBarMenu

       <Navbar fluid stacked >
                                <Navbar.Header>
                                    <Navbar.Brand>
                                     Dashboard
                                    </Navbar.Brand>
                                    <Navbar.Toggle />
                                </Navbar.Header>

                                                      </Navbar>
