import PropTypes from 'prop-types';
import React from 'react';

const Session = ({ room, user }) => (
  <div>
    <h1>
      { 'Session ' }
      { room }
    </h1>
  </div>
);

Session.propTypes = {
  room: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
};

export default Session;
