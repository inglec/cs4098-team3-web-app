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
      users: {},
      //I think Map makes more sense here as Peers are not nested objects
      //users: new Map(); { peer.name -> Peer }
      //And yes synonumus with user in this context
    };

    const { token, url, username } = props;

    //TEMP
    const tempname = Math.random().toString(36).substring(7);
    const tempurl = 'http://localhost:8081/'

    this.room = new Room();
    this.room
      .on('room-close',() => { this.onRoomClose() })
      .on('room-userconnect', (user) => { this.onUserConnect(user) });
    //TEMP

    this.room.join(tempurl, tempname, token)
      .then(() => console.debug('joined'))
      .catch(error => console.error(error));
    //this.room.join(url, username, token);
  }

  componentWillUnmount() {
    this.room.leave();
  }

  onRoomClose() {
    console.debug('room close fired');
    this.setState({ users: {} });
  }

  onUserConnect(user) {
    console.debug('user', user);
    //Set up event listeners
    user
      .on('user-disconnect', (username) => console.debug('Hook up user-disconnect'))
      .on('user-addmedia', (username, mediakind) => console.debug('Hook up user-addmedia'))
      .on('user-removemedia', (username, mediakind) => console.debug('Hook up user-removemedia'));

    //Add the user to state
    // https://lodash.com/docs/4.17.11#assign <- hoping that does what we want
    this.setState(state => ({ users : _.assign(state.users, { [user.name] : user } )}));
  }

  onUserDisconnect(username) {
    //Remove the user from state
    this.setState(state => ({
      users: _.pickBy(state.users, (user, key) => key != username),
    }));
  }

  onUserAddMedia(username, mediakind) {
    const user = this.state.users[username];
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
    const user = this.state.users[username];
    if (mediakind === 'video') {

    } else if (mediakind === 'audio') {

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
                _.map(users, (user, username) => {
                  return (
                    <Video
                      audioStream={user.audio()}
                      key={username}
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
