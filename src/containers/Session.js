import { connect } from 'react-redux';

import Session from 'app-components/Session';

import { addChatMessage } from 'app-redux/actions';
import { getAuth } from 'app-redux/selectors';

const mapStateToProps = (state) => {
  const { uid, token } = getAuth(state);
  return ({
    token,
    selfUid: uid,
  });
};

const mapDispatchToProps = dispatch => ({
  onReceiveMessage: (sessionId, { sender, text, timestamp }) => (
    dispatch(addChatMessage(sessionId, sender, text, timestamp))
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(Session);
