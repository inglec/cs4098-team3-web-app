import { map, sortBy } from 'lodash/collection';
import { pickBy } from 'lodash/object';
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

    const { selfUid, token, url } = props;

    this.state = {
      sessionId: 'testsession', // FIXME: generate
      users: {},
    };

    // Didn't put into state as we might not want to rerender whole page if
    // media cuts out
    this.ownAudioRef = React.createRef();
    this.ownVideoRef = React.createRef();
    this.ownAudioStream = null;
    this.ownVideoStream = null;

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, user => this.onUserConnect(user));
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
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state
    this.setState(state => ({
      users: pickBy(state.users, (user, key) => key !== uid),
    }));
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

  sendMessage(message) {
    const { onReceiveMessage, selfUid } = this.props;
    const { sessionId } = this.state;

    // Remove whitespace
    const trimmed = message.trim();

    if (trimmed) {
      this.room.sendMessage(trimmed);
      onReceiveMessage(sessionId, {
        uid: selfUid,
        message: trimmed,
        timestamp: new Date().getTime(),
      });
    }
  }

  render() {
    const { chat, chatUsers, selfUid } = this.props;
    const { users, sessionId } = this.state;

    // Sort messages by timestamp
    const messages = sortBy(chat[sessionId], message => message.timestamp);

    return (
      <div className="page session">
        <div className="session-main">
          <div className="videos-container">
            <div className="videos">

              {
                // TODO: Make event names constant in external file
                map(users, (user, uid) => (
                  <Video
                    key={uid}
                    uid={uid}
                    onUserAddMedia={callback => user.on(USER_ADD_MEDIA, callback)}
                    onUserRemoveMedia={callback => user.on(USER_REMOVE_MEDIA, callback)}
                  />
                ))
              }

              <div className="own-media-container">
                <audio autoPlay ref={this.ownAudioRef} />
                <video autoPlay ref={this.ownVideoRef} />
              </div>

            </div>
          </div>
          <Options
            isMuted={this.room.isMuted}
            toggleMute={() => this.room.toggleMute()}
          />
        </div>
        <Chat
          messages={messages}
          selfUid={selfUid}
          sendMessage={message => this.sendMessage(message)}
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
        message: PropTypes.string.isRequired,
        timestamp: PropTypes.number.isRequired,
        uid: PropTypes.string.isRequired,
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
