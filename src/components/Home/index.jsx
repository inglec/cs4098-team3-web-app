import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import SessionStatus from './SessionStatusBox';
import MySession from './MySessions';
import { sessions } from '../../../data/test/mockSessions';
import './styles';


const Home = ({ selfUid, isAuthenticated }) => (
  <div className="page home">
    {isAuthenticated ? <MySession uid={selfUid} sessions={sessions} /> : <Link to="/login">Log in</Link>}
  </div>
);

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  selfUid: PropTypes.string.isRequired,
};

export default Home;
