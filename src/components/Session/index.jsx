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
    console.debug(props);
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
                // Might be easier to just make user a prop of Video
                _.map(users, (user, uid) => (
                  <Video
                    user={user}
                    key={uid}
                    name={user.uid}
                    uid={user.uid}
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
