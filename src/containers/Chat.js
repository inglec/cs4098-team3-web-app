import { connect } from 'react-redux';

import Chat from 'app-components/Chat';

import { getSessionMessages, getSessionUsers } from 'app-redux/selectors';

const mapStateToProps = (state, ownProps) => {
  const messages = getSessionMessages(state, ownProps.sessionId);
  const userUids = getSessionUsers(state, ownProps.sessionId);
  return {
    messages,
    userUids,
  };
};

export default connect(mapStateToProps)(Chat);
