import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Room from 'app-utils/video/Room';
import {
  ROOM_CLOSE,
  ROOM_USER_CONNECT,
  USER_ADD_MEDIA,
  USER_REMOVE_MEDIA,
} from 'app-utils/video/events';

import Chat from './Chat';
import Options from './Options';
import Video from './Video';

import './styles';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      users: {},
    };

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, user => this.onUserConnect(user));

    const { token, uid, url } = this.props;

    this.room.join(url, uid, token);
  }

  componentWillUnmount() {
    this.room.leave();
  }

  onRoomClose() {
    this.setState({ users: {} });
  }

  onUserConnect(user) {
    // Add user to state
    this.setState(state => ({
      users: {
        ...state.users,
        [user.uid]: user,
      },
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  render() {
    const { messages, users } = this.state;

    return (
      <div className="session">
        <div className="session-main">
          <div className="videos-container">
            <div className="videos">
              {
                // TODO: Make event names constant in external file
                _.map(users, (user, uid) => (
                  <Video
                    key={uid}
                    uid={uid}
                    onUserAddMedia={callback => user.on(USER_ADD_MEDIA, callback)}
                    onUserRemoveMedia={callback => user.on(USER_REMOVE_MEDIA, callback)}
                  />
                ))
              }
            </div>
          </div>
          <Options
            isMuted={this.room.isMuted}
            toggleMute={() => this.room.toggleMute()}
          />
        </div>
        <Chat
          messages={messages}
          sendMessage={message => this.room.sendMessage(message)}
        />
      </div>
    );
  }
}

Session.propTypes = {
  token: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Session;
