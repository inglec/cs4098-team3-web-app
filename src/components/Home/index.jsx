import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import './styles';

const renderLinks = () => (
  <div className="links">
    <Link to="/session">Session</Link>
    <Link to="/profile">My Profile</Link>
  </div>
);

const Home = ({ isAuthenticated }) => (
  <div className="page home">
    {isAuthenticated ? renderLinks() : <Link to="/login">Log in</Link>}
  </div>
);

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};

export default Home;
