import { connect } from 'react-redux';

import Session from 'app-components/Session';

import { authSelector } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { username, token } = authSelector(state);

  return ({ username, token });
};

export default connect(mapStateToProps)(Session);
