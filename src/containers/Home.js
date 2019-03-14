import { connect } from 'react-redux';

import Home from 'app-components/Home';

import { getAuth } from 'app-redux/selectors';

const mapStateToProps = state => ({ isAuthenticated: !!getAuth(state).token });

export default connect(mapStateToProps)(Home);
