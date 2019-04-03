import { pickBy } from 'lodash/object';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Room from 'app-utils/video/Room';
import { ROOM_CLOSE, ROOM_USER_CONNECT } from 'app-utils/video/events';

import Chat from './Chat';
import Options from './Options';
import Video from './Video';
import VideoLayout from './VideoLayout';

import './styles';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionId: 'testsession', // FIXME: generate
      users: {},
    };

    this.onSelfAddMediaCallback = null;
    this.onSelfRemoveMediaCallback = null;

    const { selfUid, token, url } = props;

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, user => this.onUserConnect(user));
    this.room
      .join(url, selfUid, token)
      .then(({ audioStream, videoStream }) => {
        if (this.onSelfAddMediaCallback) {
          if (audioStream) {
            this.onSelfAddMediaCallback({ mediakind: 'audio', mediastream: audioStream });
          }
          if (videoStream) {
            this.onSelfAddMediaCallback({ mediakind: 'video', mediastream: videoStream });
          }
        }
      });
  }

  componentWillUnmount() {
    if (this.onSelfRemoveMediaCallback) {
      this.onSelfRemoveMediaCallback({ mediakind: 'audio' });
      this.onSelfRemoveMediaCallback({ mediakind: 'video' });
    }

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
      users: pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  onSelfAddMedia(callback) {
    this.onSelfAddMediaCallback = callback;
  }

  onSelfRemoveMedia(callback) {
    this.onSelfRemoveMediaCallback = callback;
  }

  sendMessage(text) {
    const { onReceiveMessage, selfUid } = this.props;
    const { sessionId } = this.state;

    // Remove whitespace
    const trimmed = text.trim();

    if (trimmed) {
      this.room.sendMessage(trimmed);
      onReceiveMessage(sessionId, {
        sender: selfUid,
        text: trimmed,
        timestamp: new Date().getTime(),
      });
    }
  }

  render() {
    const { chat, chatUsers, selfUid } = this.props;
    const { users, sessionId } = this.state;

    return (
      <div className="page session">
        <div className="session-main">
          <div className="videolayout-container">
            <VideoLayout users={users} />
          </div>
          <Options
            isMuted={this.room.isMuted}
            toggleMute={() => this.room.toggleMute()}
          />
        </div>
        <div className="sidebar">
          <Video
            displayName="Me"
            isMuted={this.room.isMuted}
            isSelfVideo
            onMute={() => console.log('mute: self') /* TODO */}
            onUserAddMedia={callback => this.onSelfAddMedia(callback)}
            onUserRemoveMedia={callback => this.onSelfRemoveMedia(callback)}
            uid={selfUid}
          />
          <Chat
            messages={chat[sessionId]}
            selfUid={selfUid}
            sendMessage={text => this.sendMessage(text)}
            users={chatUsers[sessionId]}
          />
        </div>
      </div>
    );
  }
}

Session.propTypes = {
  chat: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.exact({
        sender: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
      }),
    ),
  ).isRequired,
  chatUsers: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string),
  ).isRequired,
  onReceiveMessage: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  selfUid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Session;
