import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Room from 'app-utils/video/Room';
import Peer from 'app-utils/video/Peer';

import Chat from './Chat';
import Options from './Options';
import Video from './Video';

import './styles';

/*
  Eddie :
    Using this as a guide on modifying react state
    https://www.robinwieruch.de/react-state-array-add-update-remove/

    Not sure how updates to users will interact with react lifecycle as it only
    does shallow comparisons
    https://reactjs.org/docs/react-component.html#setstate
*/

//
// const state = {
//
//   users: [ Peer ],
//
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
      users: [],
    };

    //Sadly this was needed
    this.onRoomClose = this.onRoomClose.bind(this);
    this.onUserConnect = this.onUserConnect.bind(this);

    const { token, url, username } = props;

    //TEMP
    const tempname = Math.random().toString(36).substring(7);
    const tempurl = 'http://localhost:8081/'

    this.room = new Room();
    this.room
      .on('room-close', this.onRoomClose)
      .on('room-userconnect', this.onUserConnect);
    //TEMP

    this.room.join(tempurl, tempname, token)
      .then(() => console.debug('joined'))
      .catch((error) => console.error(error));
    //this.room.join(url, username, token);
  }

  componentWillUnmount() {
    this.room.leave();
  }

  onRoomClose() {
    console.debug('room close fired');
    this.setState({ users: [] });
  }

  onUserConnect(user) {
    //Set up event listeners
    user
      .on('user-disconnect', () => console.debug('Hook up user-disconnect'))
      .on('user-addmedia', () => console.debug('Hook up user-addmedia'))
      .on('user-removemedia', () => console.debug('Hook up user-removemedia'));

    console.debug('user in onuserconnect', user)
    //Add the user to state
    this.setState(state => ({ users: [...state.users, user] }));
  }

  onUserDisconnect(username) {
    //Remove the user from state
    /* REVIEW: what if multiple users have the same name, need a unique identifier */
    this.setState(state => {
      const users = this.state.users.filter(user => user.name != username);
      return { ...state, users }
    });
  }

  onUserAddMedia(username, mediakind) {
    const user = this.state.users.find(user => user.name = username)

    if (mediakind === 'video') {
      const videoStream = user.video();
      //Do something with the video
    } else if (mediakind === 'audio') {
      const audioStream = user.audio();
      //Do something with the audio
    }
  }

  onUserRemoveMedia(username, mediakind) {
    //Not sure what state change we might want here
    const user = this.state.users.find(user => user.name = username)
    if (mediakind === 'video') {

    } else if (mediakind === 'audio') {

    }
  }

  render() {
    const { messages, users } = this.state;
    console.debug('users', this.state.users);
    return (
      <div className="session">
        <div className="session-main">
          <div className="videos-container">
            <div className="videos">
              {
                // Might need to change so that state update doesn't rerender all videos.
                users.map((user) => {
                  return (
                    <Video
                      audioStream={user.audio()}
                      key={user.name}
                      mute={() => this.room.mute(user.name)}
                      tick={() => this.room.tick(user.name)}
                      username={user.name}
                      videoStream={user.video()}
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
