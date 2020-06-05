import React, { Fragment } from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
const authenticatedOptions = (
  <Fragment>
    <NavDropdown title="My Account" id="basic-nav-dropdown">
      <NavDropdown.Item><Nav.Link href="#change-password">Change Password</Nav.Link></NavDropdown.Item>
      <NavDropdown.Item><Nav.Link href="#sign-out">Sign Out</Nav.Link></NavDropdown.Item>
      <NavDropdown.Item><Nav.Link href="#get-history">View Past Purchases</Nav.Link></NavDropdown.Item>
    </NavDropdown>
    <Nav.Link href="#shopping-cart">My Cart</Nav.Link>
  </Fragment>
)

const unauthenticatedOptions = (
  <Fragment>
    <Nav.Link href="#sign-up">Sign Up</Nav.Link>
    <Nav.Link href="#sign-in">Sign In</Nav.Link>
  </Fragment>
)

const alwaysOptions = (
  <Fragment>
    <Nav.Link href="#products">Products</Nav.Link>
  </Fragment>
)

const Header = ({ user }) => (
  <Navbar className="navBar" expand="md">
    <Navbar.Brand style={{ color: '#1F4052' }} className="navBar">
<<<<<<< HEAD
      <strong>HOMEPAGE DEPOT</strong>
=======
      <strong>HOMEPAGE DEPOT</strong>
>>>>>>> Update styling
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ml-auto">
        { user && <span className="navbar-text mr-2">Welcome, {user.email}</span>}
        { alwaysOptions }
        { user ? authenticatedOptions : unauthenticatedOptions }
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default Header
