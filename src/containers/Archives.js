import { connect } from 'react-redux';

import Archives from 'app-components/Archives';

import { getGroups, getPastSessions } from 'app-redux/selectors';

const mapStateToProps = state => ({
  groups: getGroups(state),
  sessions: getPastSessions(state),
});

export default connect(mapStateToProps)(Archives);
