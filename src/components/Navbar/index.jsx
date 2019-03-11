import PropTypes from 'prop-types';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { withRouter } from 'react-router-dom';

const renderNavLink = (href, linkText, push, pathname) => (
  <Nav.Link
    active={href === pathname}
    onClick={() => push(href)}
  >
    {linkText}
  </Nav.Link>
);

const renderNavDropdown = (uid, push, onClickLogout) => (
  uid
    ? (
      <NavDropdown title={uid} alignRight>
        <NavDropdown.Item onClick={() => push('settings')}>Settings</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onClickLogout}>Log Out</NavDropdown.Item>
      </NavDropdown>
    )
    : <Nav.Link onClick={() => push('/login')}>Log In</Nav.Link>
);

const AppNavbar = (props) => {
  const {
    history: { push },
    location: { pathname },
    onClickLogout,
    uid,
  } = props;

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand href="#" onClick={() => push('/')}>Treatment Together</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        { /* Left-aligned section */ }
        <Nav className="mr-auto">
          {renderNavLink('/', 'Home', push, pathname)}
          {renderNavLink('/profile', 'My Profile', push, pathname)}
          {renderNavLink('/archives', 'Archives', push, pathname)}
        </Nav>

        { /* Right-aligned section */ }
        <Nav>{renderNavDropdown(uid, push, onClickLogout)}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

// React router props
AppNavbar.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired }).isRequired,
  onClickLogout: PropTypes.func.isRequired,

  uid: PropTypes.string,
};

AppNavbar.defaultProps = { uid: null };

// Wrap component in withRouter to access React Router props
export default withRouter(AppNavbar);
