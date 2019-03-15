import { connect } from 'react-redux';

import Home from 'app-components/Home';

import { getAuth, getSessions } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);
  const sessions = getSessions(state);
  return ({
    isAuthenticated: !!token,
    selfUid: uid,
    sessions,
  });
};

export default connect(mapStateToProps)(Home);
