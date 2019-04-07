import { connect } from 'react-redux';

import Groups from 'app-components/Groups';

import { getGroups, getUsers } from 'app-redux/selectors';

const mapStateToProps = state => ({
  groups: getGroups(state),
  users: getUsers(state),
});

export default connect(mapStateToProps)(Groups);
