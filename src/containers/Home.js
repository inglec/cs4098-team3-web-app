import { connect } from 'react-redux';

import Home from 'app-components/Home';

import { getAuth, getActiveSessions, getFutureSessions } from 'app-redux/selectors';

const mapStateToProps = state => ({
  activeSessions: getActiveSessions(state),
  futureSessions: getFutureSessions(state),
  isAuthenticated: !!getAuth(state).token,
});

export default connect(mapStateToProps)(Home);
