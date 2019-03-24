import moment from 'moment';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Scrollbar from 'react-perfect-scrollbar';
import SendIcon from 'react-feather/dist/icons/send';
import 'react-perfect-scrollbar/dist/css/styles.css';

import TextBox from 'app-components/TextBox';

import './styles';

class Chat extends Component {
  // TODO: Only scroll to bottom if the user isn't scrolling
  static scrollToBottom(ref) {
    if (ref) {
      const {
        _container: container,
        _ps: { containerHeight, contentHeight },
      } = ref;

      container.scrollTop = contentHeight - containerHeight;
    }
  }

  constructor(props) {
    super(props);
    this.colourMap = {};
  }

  render() {
    const {
      messages,
      userUids,
      selfUid,
      sendMessage,
    } = this.props;

    // Create a new colour if there is a new chatUser
    userUids
      .filter(uid => !(uid in this.colourMap))
      /* eslint-disable no-return-assign */
      .forEach(uid => this.colourMap[uid] = randomColor());

    return (
      <div className="chat">
        <span>Session Chat</span>
        <div className="messages">
          <Scrollbar ref={ref => this.constructor.scrollToBottom(ref)}>
            <div>
              {
                messages.map(({ sender, text, timestamp }) => {
                  const time = moment(timestamp).format('HH:mm:ss');

                  const style = { color: this.colourMap[sender] };
                  if (sender === selfUid) {
                    style.textDecoration = 'underline';
                  }

                  return (
                    <Card className="message" key={`${sender}:${timestamp}`}>
                      <div>
                        <span className="user">
                          <span style={style}>{sender}</span>
                          {': '}
                        </span>
                        {text}
                      </div>
                      <div className="time-container">
                        <Badge pill variant="light" className="time">{time}</Badge>
                      </div>
                    </Card>
                  );
                })
              }
            </div>
          </Scrollbar>
        </div>
        <TextBox buttonLabel=<SendIcon /> placeholder="Send a message" onSubmit={sendMessage} />
      </div>
    );
  }
}

Chat.propTypes = {
  selfUid: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
  sessionId: PropTypes.string.isRequired, // It is used in mapStateToProps
  messages: PropTypes.arrayOf(
    PropTypes.exact({
      text: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      sender: PropTypes.string.isRequired,
    }),
  ).isRequired,
  userUids: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Chat;
