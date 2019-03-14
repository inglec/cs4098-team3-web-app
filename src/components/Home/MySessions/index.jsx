import PropTypes from 'prop-types';
import React from 'react';
import SessionStatus from '../SessionStatusBox';
import './styles';


const MySessions = ({ uid, sessions }) => {
  const cards = sessions && sessions.map(session => <SessionStatus uid={uid} session={session} />);
  return (
    <div className="mySessions">
      <h1>My Sessions</h1>
      <div className="cardHolders">
        { cards }
      </div>
    </div>
  );
};

MySessions.propTypes = {
  uid: PropTypes.string.isRequired,
  sessions: PropTypes.arrayOf(PropTypes.object).isRequired,
};
export default MySessions;
