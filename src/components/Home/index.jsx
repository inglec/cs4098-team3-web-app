import { map } from 'lodash/collection';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import './styles';

const renderSessionBox = (sessionId, startTime, endTime, isActive, onClick) => {
  const startTimeString = moment(startTime).format('Do MMMM, h:mma');
  const status = `Session ${isActive ? 'is active' : 'has not yet begun'}.`;
  const imageSrc = `../../data/test/${isActive ? 'live.png' : 'future.png'}`;

  return (
    <Card>
      <Card.Body>
        <img src={imageSrc} alt={sessionId} />
        <Card.Title>{startTimeString}</Card.Title>
        <Card.Text>{status}</Card.Text>
        {isActive ? <Button block onClick={onClick}>Join Session</Button> : null}
      </Card.Body>
    </Card>
  );
};

const renderSessionList = (title, sessions, isActive, onClick = () => {}) => (
  <div className="sessionlist">
    <h2>{title}</h2>
    <div className="sessions">
      {
        map(sessions, ({ endTime, startTime }, sessionId) => (
          renderSessionBox(sessionId, startTime, endTime, isActive, onClick)
        ))
      }
    </div>
  </div>
);

const renderSessionLists = (activeSessions, futureSessions, push) => (
  <div className="page-container">
    {renderSessionList('Active Sessions', activeSessions, true, () => push('/session'))}
    {renderSessionList('Future Sessions', futureSessions, false)}
  </div>
);

const Home = (props) => {
  const {
    activeSessions,
    futureSessions,
    history,
    isAuthenticated,
  } = props;

  return (
    <div className="page home">
      {
        isAuthenticated
          ? renderSessionLists(activeSessions, futureSessions, history.push)
          : <Link to="/login">Log in</Link>
      }
    </div>
  );
};

Home.propTypes = {
  activeSessions: PropTypes.object.isRequired,
  futureSessions: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default Home;
