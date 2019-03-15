import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import SessionList from './SessionList';
import { sessions } from '../../../data/test/mockSessions';
import './styles';

const createSessionLists = (push) => {
  const activeSessions = sessions.filter(session => session.active);
  const reviewSessions = sessions.filter(session => !session.active && session.complete);
  const futureSessions = sessions.filter(session => !session.active && !session.complete);

  return (
    <div>
      <SessionList sessions={activeSessions} title="Active Sessions" push={push} path="/session" />
      <SessionList sessions={reviewSessions} title="Past Sessions" push={push} path="/review" />
      <SessionList sessions={futureSessions} title="Future Sessions" push={push} path="" />
    </div>
  );
};
const Home = ({ isAuthenticated, history }) => {
  const { push } = history;

  return (
    <div className="page home">
      {isAuthenticated ? createSessionLists(push) : <Link to="/login">Log in</Link>}
    </div>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default Home;
