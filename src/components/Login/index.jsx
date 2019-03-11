import PropTypes from 'prop-types';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';

import LoginBox from 'app-components/LoginBox';
import Spinner from 'app-components/Spinner';

import './styles';

const renderError = error => (
  <Alert variant="danger" className="login-error">
    {'Error: '}
    {error}
  </Alert>
);

const renderLoginPage = (error, loading, onSubmitCredentials) => (
  <div className="page login">
    <div className="login-container">
      <h3>Log In to Treatment Together</h3>
      <div>
        <LoginBox onSubmit={onSubmitCredentials} />
        <div className="login-status">
          {error ? renderError(error) : null}
          {loading ? <Spinner /> : null}
        </div>
      </div>
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
