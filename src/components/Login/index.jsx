import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import LoginBox from 'app-components/LoginBox';
import Spinner from 'app-components/Spinner';

import './styles';

const renderError = error => (
  <span className="login-error">
    { 'Error: ' }
    { error }
  </span>
);

const renderLoginPage = (error, loading, onSubmitCredentials) => (
  <div>
    <h1>Log In</h1>
    <div className="login">
      <LoginBox onSubmit={onSubmitCredentials} />
      { error ? renderError(error) : null }
      { loading ? <Spinner /> : null }
    </div>
  </div>
);

// Redirect the user back to the home page if they're already logged in.
const Login = ({
  error,
  isAuthenticated,
  loading,
  onSubmitCredentials,
}) => (
  isAuthenticated
    ? <Redirect to="/" />
    : renderLoginPage(error, loading, onSubmitCredentials)
);

Login.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onSubmitCredentials: PropTypes.func.isRequired,

  error: PropTypes.string,
};

Login.defaultProps = {
  error: '',
};

export default Login;
