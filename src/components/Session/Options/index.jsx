import PropTypes from 'prop-types';
import React from 'react';

import './styles';

const Options = ({ isMuted, toggleMute }) => (
  <div className="video-options">
    <span>Options</span>
    <button type="button" onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
  </div>
);

Options.propTypes = {
  isMuted: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
};

export default Options;
