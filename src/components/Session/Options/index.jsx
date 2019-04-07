import PropTypes from 'prop-types';
import React from 'react';

import HangUpIcon from 'react-feather/dist/icons/phone-off';

import './styles';

const Options = ({ onHangUp }) => (
  <div className="video-options">
    <button type="button" className="hangup" onClick={onHangUp}>
      <HangUpIcon />
    </button>
  </div>
);

Options.propTypes = {
  onHangUp: PropTypes.func.isRequired,
};

export default Options;
