import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './styles';

/*
  https://www.w3.org/TR/mediacapture-streams/#mediastreamtrack
  MediaStreams
*/

class Video extends Component {
  constructor(props) {
    super(props);

    this.audioRef = React.createRef();
    this.videoRef = React.createRef();
    this.user = props.user;

    /*
      media = {uid, mediakind, mediastream}
    */
    this.user.on('user-addmedia', (media) => {
      if (media.mediakind === 'video') {
        this.videoRef.current.srcObject = media.mediastream;
      }
      if (media.mediakind === 'audio') {
        this.audioRef.current.srcObject = media.mediastream;
      }
    });

    this.user.on('user-removemedia', (obj) => {
      // Unmount component, maybe some extra stuff
    });
  }

  render() {
    return (
      <div className="user-media">
        <video
          ref={this.videoRef}
          className="video"
          autoPlay
        />
        <audio
          ref={this.audioRef}
          className="audio"
          autoPlay
        />
      </div>
    );
  }
}

Video.propTypes = {
  user: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
};

export default Video;
