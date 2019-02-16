import { connect } from 'react-redux';

import Home from 'app-components/Home';

import { authSelector } from 'app-redux/selectors';

const mapStateToProps = state => ({ isAuthenticated: !!authSelector(state).token });

export default connect(mapStateToProps)(Home);
