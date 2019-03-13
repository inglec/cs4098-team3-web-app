import React from 'react';
import PropTypes from 'prop-types';

import './styles';

const LogMessage = ({
  type, sender, message, timestamp,
}) => (
  <div className="log-message-container">
    <LogSender sender={sender} />
    <LogMessageContent type={type} message={message} />
  </div>
);


// Better without I think
const LogTimeStamp = ({ timestamp }) => {
  const dt = new Date(Date.parse(timestamp));
  return (
    <i className="log-message-timestamp">
      {`${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()} - `}
    </i>
  );
};

const LogSender = ({ sender }) => {
  if (sender === 'system') {
    return (null);
  }
  return (<b>{sender}</b>);
};

const LogMessageContent = ({ type, message }) => {
  if (type === 'info') {
    return (<i className="log-message-info">{message}</i>);
  }
  return (<p className="log-message-general">{message}</p>);
};

LogMessage.propTypes = {
  type: PropTypes.string.isRequired,
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
};

LogTimeStamp.propTypes = {
  timestamp: PropTypes.string.isRequired,
};

LogSender.propTypes = {
  sender: PropTypes.string.isRequired,
};

LogMessageContent.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default LogMessage;
