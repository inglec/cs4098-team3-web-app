import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './styles';

class LoginBox extends Component {
  constructor(props) {
    super(props);

    this.state = { username: '', password: '' };
  }

  onChangeUsername(event) {
    this.setState({ username: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const { username, password } = this.state;
    const { onSubmit } = this.props;

    return (
      <div className="loginbox">
        <div className="loginbox-field">
          <span>Username</span>
          <input
            type="text"
            onChange={event => this.onChangeUsername(event)}
          />
        </div>

        <div className="loginbox-field">
          <span>Password</span>
          <input
            type="password"
            onChange={event => this.onChangePassword(event)}
          />
        </div>

        <div className="loginbox-submit-container">
          <button
            type="button"
            className="loginbox-submit"
            onClick={() => onSubmit(username, password)}
          >
            Log in
          </button>
        </div>
      </div>
    );
  }
}

LoginBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginBox;
