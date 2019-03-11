import { connect } from 'react-redux';

import Navbar from 'app-components/Navbar';

import { logOut } from 'app-redux/actions';
import { authSelector } from 'app-redux/selectors';

const mapStateToProps = state => ({ uid: authSelector(state).uid });

const mapDispatchToProps = dispatch => ({ onClickLogout: () => dispatch(logOut()) });

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
