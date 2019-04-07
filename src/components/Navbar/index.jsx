import { get } from 'lodash/object';
import PropTypes from 'prop-types';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ArchivesIcon from 'react-feather/dist/icons/archive';
import GroupsIcon from 'react-feather/dist/icons/users';
import HomeIcon from 'react-feather/dist/icons/home';
import LogoutIcon from 'react-feather/dist/icons/log-out';
import ProfileIcon from 'react-feather/dist/icons/user';
import SettingsIcon from 'react-feather/dist/icons/settings';
import { withRouter } from 'react-router-dom';

import IconedText from 'app-components/IconedText';

const renderNavLink = (href, linkText, push, pathname) => (
  <Nav.Link active={href === pathname} onClick={() => push(href)}>
    {linkText}
  </Nav.Link>
);

const renderNavDropdown = (uid, push, onClickLogout) => (
  uid
    ? (
      <NavDropdown title={uid} alignRight>
        <NavDropdown.Item onClick={() => push('settings')}>
          <IconedText icon={SettingsIcon}>Settings</IconedText>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={onClickLogout}>
          <IconedText icon={LogoutIcon}>Log Out</IconedText>
        </NavDropdown.Item>
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
    user,
  } = props;

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Navbar.Brand href="#" onClick={() => push('/')}>Treatment Together</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {/* Left-aligned section */}
        <Nav className="mr-auto">
          {renderNavLink('/', <IconedText icon={HomeIcon}>Home</IconedText>, push, pathname)}
          {
            renderNavLink(
              '/profile',
              <IconedText icon={ProfileIcon}>My Profile</IconedText>,
              push,
              pathname,
            )
          }
          {
            renderNavLink(
              '/archives',
              <IconedText icon={ArchivesIcon}>Archives</IconedText>,
              push,
              pathname,
            )
          }
          {
            get(user, 'userType') === 'admin'
              ? renderNavLink(
                '/groups',
                <IconedText icon={GroupsIcon}>Group Management</IconedText>,
                push,
                pathname,
              )
              : null
          }
        </Nav>

        { /* Right-aligned section */ }
        <Nav>{renderNavDropdown(uid, push, onClickLogout)}</Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

// React router props
AppNavbar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  onClickLogout: PropTypes.func.isRequired,

  uid: PropTypes.string,

  // FIXME
  user: PropTypes.object,
};

AppNavbar.defaultProps = {
  uid: null,
  user: null,
};

// Wrap component in withRouter to access React Router props
export default withRouter(AppNavbar);
