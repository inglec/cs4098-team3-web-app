import moment from 'moment';
import PropTypes from 'prop-types';
import randomColor from 'randomcolor';
import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Scrollbar from 'react-perfect-scrollbar';
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

    // Map of users to random colours
    this.colourMap = {};
  }

  render() {
    const {
      messages,
      selfUid,
      sendMessage,
      users,
    } = this.props;

    // Generate unique colour for each user
    this.colourMap = users.reduce((colourMap, user) => {
      if (!(user in colourMap)) {
        // eslint-disable-next-line no-param-reassign
        colourMap[user] = randomColor();
      }
      return colourMap;
    }, this.colourMap);

    return (
      <div className="chat">
        <span>Session Chat</span>
        <div className="messages">
          <Scrollbar ref={ref => this.constructor.scrollToBottom(ref)}>
            <div>
              {
                messages.map(({ message, timestamp, uid }) => {
                  const time = moment(timestamp).format('HH:mm:ss');

                  const style = { color: this.colourMap[uid] };
                  if (uid === selfUid) {
                    style.textDecoration = 'underline';
                  }

                  return (
                    <Card className="message" key={`${uid}:${timestamp}`}>
                      <div>
                        <span className="user">
                          <span style={style}>{uid}</span>
                          {': '}
                        </span>
                        {message}
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
        <TextBox buttonLabel="Send" placeholder="Send a message" onSubmit={sendMessage} />
      </div>
    );
  }
}

Chat.propTypes = {
  selfUid: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,

  messages: PropTypes.arrayOf(
    PropTypes.exact({
      message: PropTypes.string.isRequired,
      timestamp: PropTypes.number.isRequired,
      uid: PropTypes.string.isRequired,
    }),
  ),
  users: PropTypes.arrayOf(PropTypes.string),
};

Chat.defaultProps = {
  messages: [],
  users: [],
};

export default Chat;
