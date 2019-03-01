/* eslint-disable react/no-unused-prop-types */

import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

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
    this.room.join(client);
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

    this.setState(state => ({
      users: {
        ...state.users,
        [user.uid]: _.pickBy(user, (value, key) => key !== 'uid'),
      },
    }));
  }

  onUserDisconnect(uid) {
    // Remove user from state
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key !== uid),
    }));
  }

  getClient() {
    return _.pick(this.props, ['token', 'uid', 'url']);
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
                    onUserAddMedia={callback => user.on('user-addmedia', callback)}
                    onUserRemoveMedia={callback => user.on('user-removemedia', callback)}
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
  uid: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default Session;
