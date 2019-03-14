import { connect } from 'react-redux';

import Session from 'app-components/Session';

import { addChatMessage } from 'app-redux/actions';
import { getAuth, getChat, getChatUsers } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);

  return ({
    chat: getChat(state),
    chatUsers: getChatUsers(state),
    token,
    selfUid: uid,
  });
};

const mapDispatchToProps = dispatch => ({
  onReceiveMessage: (sessionId, { message, uid, timestamp }) => (
    dispatch(addChatMessage(sessionId, uid, message, timestamp))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Session);
