import { connect } from 'react-redux';

import { videoServerUrl } from 'app-config';
import Session from 'app-components/Session';
import { addChatMessage } from 'app-redux/actions';
import { getAuth, getUsers } from 'app-redux/selectors';


const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);
  return ({
    token,
    selfUid: uid,
    url: videoServerUrl,
    users: getUsers(state),
  });
};

const mapDispatchToProps = dispatch => ({
  onReceiveMessage: (sessionId, { sender, text, timestamp }) => (
    dispatch(addChatMessage(sessionId, sender, text, timestamp))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Session);
