import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Peer from 'app-utils/video/Peer';
import Room from 'app-utils/video/Room';

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
      .on('room-close', () => this.onRoomClose())
      .on('room-userconnect', user => this.onUserConnect(user));

    const client = this.getClient();
    this.room.join(client)
      .then(() => console.debug('joined'))
      .catch(error => console.error(error));
  }

  componentWillUnmount() {
    this.room.leave();
  }

  onRoomClose() {
    console.debug('Closing room');
    this.setState({ users: {} });
  }

  onUserConnect(user) {
    // Set up event listeners
    user
      .on('user-disconnect', uid => console.debug('user-disconnect', uid))
      .on('user-addmedia', (uid, mediakind) => {
        console.debug('user-addmedia', uid, mediakind);
      })
      .on('user-removemedia', (uid, mediakind) => {
        console.debug('user-removemedia', uid, mediakind);
      });

    // Add user to state.
    this.setState(state => ({
      users: {
        ...state.users,
        [user.name]: user,
      },
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state.
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  onUserAddMedia(uid, mediakind) {
    const { users } = this.state;
    const user = users[uid];

    if (mediakind === 'video') {
      const videoStream = user.video();

      // TODO: Do something with the video.
    } else if (mediakind === 'audio') {
      const audioStream = user.audio();

      // TODO: Do something with the audio.
    }
  }

  onUserRemoveMedia(uid, mediakind) {
    const { users } = this.state;
    const user = users[uid];

    // Not sure what state change we might want here.
    if (mediakind === 'video') {
      // TODO
    } else if (mediakind === 'audio') {
      // TODO
    }
  }

  getClient() {
    const { token, uid, url } = this.props;
    return { token, uid, url };
  }

  render() {
    const { messages, users } = this.state;

    return (
      <div className="session">
        <div className="session-main">
          <div className="videos-container">
            <div className="videos">
              {
                // Might need to change so that state update doesn't rerender all videos.
                _.map(users, (user, uid) => (
                  <Video
                    audioStream={user.audio()}
                    isMuted={user.getIsMuted()}
                    key={uid}
                    mute={() => this.room.toggleMute(user.name)}
                    name={user.name}
                    tick={() => this.room.tick(user.name)}
                    uid={user.id}
                    videoStream={user.video()}
                  />
                ))
              }
            </div>
          </div>
          <Options
            isMuted={this.room.isMuted()}
            toggleMute={() => this.room.toggleMute()}
          />

          // Development Purposes

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
