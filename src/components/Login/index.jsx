import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginBox from 'app-components/LoginBox';

import './styles';

const renderError = error => (
  <p className="login-error">
    { 'Error: ' }
    { error }
  </p>
);

const renderLoginPage = (error, onSubmitCredentials) => (
  <div>
    <h1>Log In</h1>
    <div className="login">
      <LoginBox onSubmit={onSubmitCredentials} />
      { error ? renderError(error) : null }
    </div>
  </div>
);

// Redirect the user back to the home page if they're already logged in.
const Login = ({ error, isAuthenticated, onSubmitCredentials }) => (
  isAuthenticated
    ? <Redirect to="/" />
    : renderLoginPage(error, onSubmitCredentials)
);

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  onSubmitCredentials: PropTypes.func.isRequired,

  error: PropTypes.string,
};

Login.defaultProps = {
  error: '',
};

export default Login;
