import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Room from 'app-utils/video/Room';
import Peer from 'app-utils/video/Peer';

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

    const { token, url, username } = props;
    this.room.join(url, username, token)
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
      .on('user-disconnect', username => console.debug('user-disconnect', username))
      .on('user-addmedia', (username, mediakind) => {
        console.debug('user-addmedia', username, mediakind);
      })
      .on('user-removemedia', (username, mediakind) => {
        console.debug('user-removemedia', username, mediakind);
      });

    // Add user to state.
    this.setState(state => ({
      users: {
        ...state.users,
        [user.name]: user,
      },
    }));
  }

  onUserDisconnect(username) {
    // Remove user from state.
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key !== username),
    }));
  }

  onUserAddMedia(username, mediakind) {
    const { users } = this.state;
    const user = users[username];

    if (mediakind === 'video') {
      const videoStream = user.video();

      // TODO: Do something with the video.
    } else if (mediakind === 'audio') {
      const audioStream = user.audio();

      // TODO: Do something with the audio.
    }
  }

  onUserRemoveMedia(username, mediakind) {
    const { users } = this.state;
    const user = users[username];

    // Not sure what state change we might want here.
    if (mediakind === 'video') {
      // TODO
    } else if (mediakind === 'audio') {
      // TODO
    }
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
                _.map(users, (user, username) => (
                  <Video
                    audioStream={user.audio()}
                    key={username}
                    mute={() => this.room.mute(user.name)}
                    tick={() => this.room.tick(user.name)}
                    username={user.name}
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
  url: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

export default Session;
