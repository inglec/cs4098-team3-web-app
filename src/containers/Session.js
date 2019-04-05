import { connect } from 'react-redux';

import { videoServerUrl } from 'app-config';
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
    url: videoServerUrl,
  });
};

const mapDispatchToProps = dispatch => ({
  onReceiveMessage: (sessionId, { sender, text, timestamp }) => (
    dispatch(addChatMessage(sessionId, sender, text, timestamp))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Session);
