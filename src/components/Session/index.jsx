import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

// import Room from 'app-utils/Mediasoup';

import Chat from './Chat';
import Options from './Options';
import Video from './Video';

import './styles';

// TODO: Remove dummy class.
class Room {
  constructor() {}
  isMuted() { return false; }
  join() {}
  leave() {}
  mute() {}
  on() { return this; }
  sendMessage() {}
  tick() {}
  toggleMute() {}
}

// const state = {
//   users: {
//     String: {
//       audioStream: Object,
//       videoStream: Object,
//     },
//   },
//   messages: [
//     {
//       username: String,
//       timestamp: Number,
//       content: String,
//     },
//   ],
// };

class Session extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],

      // TODO: Replace with empty object.
      users: {
        a: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
        b: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
        c: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
        d: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
        e: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
        f: { videoStream: 'http://techslides.com/demos/sample-videos/small.mp4' },
      },
    };

    const { token, url, username } = props;

    this.room = new Room();
    this.room
      .on('user-connect', this.addUser)
      .on('user-disconnect', this.removeUser)
      .on('user-add-media', this.addMedia)
      .on('user-remove-media', this.removeMedia);
    this.room.join(url, username, token);
  }

  componentWillUnmount() {
    this.room.leave();
  }

  addUser(user) {
    this.setState({
      [user.username]: _.pick(user, ['audioStream', 'videoStream']),
    });
  }

  removeUser(username) {
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key !== username),
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
                // Might need to change so that state update doesn't rerender all videos.
                _.map(users, (user, username) => {
                  const { audioStream, videoStream } = user;
                  return (
                    <Video
                      audioStream={audioStream}
                      key={username}
                      mute={() => this.room.mute(username)}
                      tick={() => this.room.tick(username)}
                      username={username}
                      videoStream={videoStream}
                    />
                  );
                })
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
