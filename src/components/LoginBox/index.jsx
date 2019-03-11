import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

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
      <Card body className="loginbox">
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              name="username"
              type="text"
              placeholder="Enter username"
              onChange={event => this.onChangeUsername(event)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter password"
              onChange={event => this.onChangePassword(event)}
            />
          </Form.Group>
        </Form>

        <div className="loginbox-button-container">
          <Button
            type="button"
            variant="primary"
            onClick={() => onSubmit(username, password)}
          >
            Log in
          </Button>
        </div>
      </Card>
    );
  }
}

LoginBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default LoginBox;
