import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import SessionList from './SessionList';
import './styles';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const createSessionLists = (sessions, push) => {
  const activeSessions = [];
  const futureSessions = [];

  const time = new Date().getTime();
  const keys = Object.keys(sessions);
  for (let i = 0; i < keys.length; i += 1) {
    if (sessions[keys[i]].startTime > time) {
      futureSessions.push(sessions[keys[i]]);
    } else if (time - sessions[keys[i]].startTime < HOUR) {
      activeSessions.push(sessions[keys[i]]);
    }
  }

  return (
    <div className="page-container">
      <SessionList sessions={activeSessions} title="Active Sessions" push={push} path="/session" />
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
