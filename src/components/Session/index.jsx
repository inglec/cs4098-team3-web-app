import { pickBy } from 'lodash/object';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Chat from 'app-containers/Chat';
import Room from 'app-utils/video/Room';
import {
  ROOM_CLOSE,
  ROOM_USER_CONNECT,
  ROOM_CHAT_MESSAGE,
  USER_DISCONNECT,
} from 'app-utils/video/events';

import Options from './Options';
import Video from './Video';
import VideoLayout from './VideoLayout';

import './styles';

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peers: {},
      sessionId: null,
    };

    this.onSelfAddMediaCallback = null;
    this.onSelfRemoveMediaCallback = null;

    const { selfUid, token, url } = props;

    this.room = new Room();
    this.room
      .on(ROOM_CLOSE, () => this.onRoomClose())
      .on(ROOM_USER_CONNECT, peer => this.onPeerConnect(peer))
      .on(ROOM_CHAT_MESSAGE, message => this.onRoomChatMessage(message));

    this.room
      .join(url, selfUid, token)
      .then(({ sessionId, audioStream, videoStream }) => {
        this.setState({ sessionId });
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
    this.leaveRoom();
  }

  onRoomClose() {
    this.setState({ peers: {} });
  }

  onPeerConnect(peer) {
    // Add peer to state
    peer.on(USER_DISCONNECT, uid => this.onPeerDisconnect(uid));
    this.setState(state => ({
      peers: {
        ...state.peers,
        [peer.uid]: peer,
      },
    }));
  }

  onPeerDisconnect(uid) {
    // Remove peer from state
    this.setState(state => ({
      peers: pickBy(state.peers, (peer, key) => key !== uid),
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

  onHangUp() {
    const { history } = this.props;

    this.leaveRoom();
    history.push('/');
  }

  leaveRoom() {
    if (this.onSelfRemoveMediaCallback) {
      this.onSelfRemoveMediaCallback({ mediakind: 'audio' });
      this.onSelfRemoveMediaCallback({ mediakind: 'video' });
    }

    this.room.leave();
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
    const { selfUid, users } = this.props;
    const { peers, sessionId } = this.state;

    return (
      <div className="page session">
        <div className="session-main">
          <div className="videolayout-container">
            <VideoLayout peers={peers} users={users} />
          </div>
          <Options onHangUp={() => this.onHangUp()} />
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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  token: PropTypes.string.isRequired,
  selfUid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  users: PropTypes.object.isRequired,
  onReceiveMessage: PropTypes.func.isRequired,
};

export default Session;
