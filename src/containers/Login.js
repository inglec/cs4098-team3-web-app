import { connect } from 'react-redux';

import Login from 'app-components/Login';

import { logIn } from 'app-redux/actions';
import { LOADING } from 'app-redux/reducer';
import { authSelector } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { error, status, token } = authSelector(state);

  return {
    error,
    loading: status === LOADING,
    isAuthenticated: !!token,
  };
};

const mapDispatchToProps = dispatch => ({
  onSubmitCredentials: (uid, password) => dispatch(logIn(uid, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
