import { connect } from 'react-redux';

import Session from 'app-components/Session';

import { authSelector } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = authSelector(state);

  return ({ uid, token });
};

export default connect(mapStateToProps)(Session);
