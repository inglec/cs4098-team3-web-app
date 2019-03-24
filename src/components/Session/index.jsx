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
import VideoLayout from './VideoLayout';

import './styles';

class Session extends Component {
  constructor(props) {
    super(props);

    const { selfUid, token, url } = props;

    this.state = {
      sessionId: 'testsession', // FIXME: generate
      users: {},
    };

    // Didn't put into state as we might not want to rerender whole page if
    // media cuts out
    this.ownAudioRef = createRef();
    this.ownVideoRef = createRef();
    this.ownAudioStream = null;
    this.ownVideoStream = null;

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, user => this.onUserConnect(user))
      .on(ROOM_CHAT_MESSAGE, message => this.onRoomChatMessage(message));

    this.room
      .join(url, selfUid, token)
      .then(({ audioStream, videoStream }) => {
        this.ownAudioStream = audioStream;
        this.ownVideoStream = videoStream;

        // Refs may not have been set if not rendered yet
        this.tryMountOwnMedia();
      });
  }

  componentDidMount() {
    // Media elements may not have been retrieved before render
    this.tryMountOwnMedia();
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
      // TODO: Logic for chatUsers into store
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state
    this.setState(state => ({
      users: pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  // Ideally this should go into chat but
  // then chat must be aware of room, works for now
  onRoomChatMessage(message) {
    const { onReceiveMessage } = this.props;
    const { sessionId } = this.state;
    onReceiveMessage(sessionId, message);
  }

  tryMountOwnMedia() {
    // Check if both the ref has been created and the media has been gotten
    if (this.ownAudioStream && this.ownAudioRef.current) {
      this.ownAudioRef.current.srcObject = this.ownAudioStream;
    }
    if (this.ownVideoStream && this.ownVideoRef.current) {
      this.ownVideoRef.current.srcObject = this.ownVideoStream;
    }
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
        <Chat
          messages={chat[sessionId]}
          selfUid={selfUid}
          sendMessage={text => this.sendMessage(text)}
          users={chatUsers[sessionId]}
        />
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
