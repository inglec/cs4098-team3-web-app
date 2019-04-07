import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import SessionList from './SessionList';
import './styles';

const createSessionLists = (sessions, push) => {
  const activeSessions = [];
  const futureSessions = [];

  const keys = Object.keys(sessions);
  for (let i = 0; i < keys.length; i += 1) {
    const session = sessions[keys[i]];
    const startTime = moment(session.startTime, 'x');
    const endTime = moment(session.endTime, 'x');
    const complete = moment().isAfter(endTime);
    const active = moment().isBetween(startTime, endTime);

    if (complete) {
      futureSessions.push(sessions[keys[i]]);
    } else if (active) {
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
