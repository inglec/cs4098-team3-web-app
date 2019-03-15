import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import SessionList from './SessionList';
import './styles';

const createSessionLists = (sessions, push) => {
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
const Home = ({ isAuthenticated, history, sessions }) => {
  const { push } = history;

  return (
    <div className="page home">
      {isAuthenticated ? createSessionLists(sessions, push) : <Link to="/login">Log in</Link>}
    </div>
  );
};

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  sessions: PropTypes.arrayOf(PropTypes.exact({
    day: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    complete: PropTypes.bool.isRequired,
  })).isRequired,
};

export default Home;
