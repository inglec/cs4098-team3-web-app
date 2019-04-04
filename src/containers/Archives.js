import { connect } from 'react-redux';

import Archives from 'app-components/Archives';

import { getGroups, getPastSessions, getUser } from 'app-redux/selectors';

const mapStateToProps = state => ({
  groups: getGroups(state),
  sessions: getPastSessions(state),
  user: getUser(state),
});

export default connect(mapStateToProps)(Archives);
