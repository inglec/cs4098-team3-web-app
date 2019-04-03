import { connect } from 'react-redux';

import Profile from 'app-components/Profile';

import { updateProfile } from 'app-redux/actions';
import { getAuth, getUser } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);

  return {
    ...getUser(state),
    token,
    uid,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateProfile: (token, profile) => dispatch(updateProfile(token, profile)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
