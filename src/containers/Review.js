import { parse } from 'query-string';
import { connect } from 'react-redux';

import Review from 'app-components/Review';
import { getChat, getSessions, getUsers } from 'app-redux/selectors';

const mapStateToProps = (state, { location }) => {
  const { sessionId } = parse(location.search);

  const chat = getChat(state)[sessionId];
  const session = getSessions(state)[sessionId];

  return {
    chat,
    session,
    users: getUsers(state),
  };
};

export default connect(mapStateToProps)(Review);
