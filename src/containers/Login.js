import { connect } from 'react-redux';

import Login from 'app-components/Login';

import { logIn } from 'app-redux/actions';
import { authSelector } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { error, token } = authSelector(state);

  return {
    error,
    isAuthenticated: !!token,
  };
};

const mapDispatchToProps = dispatch => ({
  onSubmitCredentials: (username, password) => dispatch(logIn(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
