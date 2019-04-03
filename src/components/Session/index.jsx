import { pickBy } from 'lodash/object';
import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';

import Chat from 'app-containers/Chat'
import Room from 'app-utils/video/Room';
import {
  ROOM_CLOSE,
  ROOM_USER_CONNECT,
  ROOM_CHAT_MESSAGE,
 } from 'app-utils/video/events';

import Options from './Options';
import Video from './Video';
import VideoLayout from './VideoLayout';

import './styles';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionId: null,
      users: {},
    };

    this.onSelfAddMediaCallback = null;
    this.onSelfRemoveMediaCallback = null;

    const { selfUid, token, url } = props;

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, user => this.onUserConnect(user))
      .on(ROOM_CHAT_MESSAGE, message => this.onRoomChatMessage(message));

    this.room
      .join(url, selfUid, token)
      .then(({ sessionId, audioStream, videoStream }) => {
        this.setState(state => ({ ...state, sessionId }));
        if (audioStream) {
          this.onSelfAddMediaCallback({ mediakind: 'audio', mediastream: audioStream });
        }
        if (videoStream) {
          this.onSelfAddMediaCallback({ mediakind: 'video', mediastream: videoStream });
        }
      });
  }

  componentWillUnmount() {
    this.onSelfRemoveMediaCallback({ mediakind: 'audio' });
    this.onSelfRemoveMediaCallback({ mediakind: 'video' });

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
      // TODO: Logic for chatUsers into store
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state
    this.setState(state => ({
      users: pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  onRoomChatMessage(message) {
    const { onReceiveMessage } = this.props;
    const { sessionId } = this.state;
    onReceiveMessage(sessionId, message);
  }

  onSelfAddMedia(callback) {
    this.onSelfAddMediaCallback = callback;
  }

  onSelfRemoveMedia(callback) {
    this.onSelfRemoveMediaCallback = callback;
  }

  sendMessage(text) {
    const { selfUid } = this.props;

    const message = {
      sender: selfUid,
      text: text.trim(), // Remove whitespace
      timestamp: new Date().getTime(),
    };

    if (message.text) {
      this.room.sendMessage(message);
      this.onRoomChatMessage(message);
    }
  }

  render() {
    const { selfUid } = this.props;
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
            uid={selfUid}
            onUserAddMedia={callback => this.onSelfAddMedia(callback)}
            onUserRemoveMedia={callback => this.onSelfRemoveMedia(callback)}
          />
          <Chat
            selfUid={selfUid}
            sessionId={sessionId}
            sendMessage={text => this.sendMessage(text)}
          />
        </div>
      </div>
    );
  }
}

Session.propTypes = {
  token: PropTypes.string.isRequired,
  selfUid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onReceiveMessage: PropTypes.func.isRequired,
};

export default Session;
