import PropTypes from 'prop-types';
import React from 'react';

import TextBox from 'app-components/TextBox';

import './styles';

const Chat = ({ messages, sendMessage }) => (
  <div className="chat">
    <span>Chat</span>
    <div className="messages">
      {
        messages.map((message, timestamp) => (
          <div className="message">
            <span className="timestamp">{timestamp}</span>
            <span className="content">{message.content}</span>
          </div>
        ))
      }
    </div>
    <TextBox buttonLabel="Send" placeholder="Send a message" onSubmit={sendMessage} />
  </div>
);

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.exact({
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      uid: PropTypes.string.isRequired,
    }),
  ).isRequired,
  sendMessage: PropTypes.func.isRequired,
};

export default Chat;
