import { connect } from 'react-redux';

import App from 'app-components/App';

import { getAuth } from 'app-redux/selectors';

const mapStateToProps = state => ({ isAuthenticated: !!getAuth(state).token });

// Map Redux store to props of App component using mapStateToProps.
export default connect(mapStateToProps)(App);
