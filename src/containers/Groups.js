import { connect } from 'react-redux';

import Groups from 'app-components/Groups';

import { getGroups } from 'app-redux/selectors';

const mapStateToProps = state => ({
  groups: getGroups(state),
});

export default connect(mapStateToProps)(Groups);
