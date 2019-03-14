import { connect } from 'react-redux';

import Home from 'app-components/Home';

import { getAuth } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);

  return ({
    isAuthenticated: !!token,
    selfUid: uid,
  });
};

export default connect(mapStateToProps)(Home);
