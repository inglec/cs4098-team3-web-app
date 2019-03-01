/* eslint-disable jsx-a11y/media-has-caption */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './styles';

/**
 * https://www.w3.org/TR/mediacapture-streams/#mediastreamtrack
 * MediaStreams
 */

class Video extends Component {
  constructor(props) {
    super(props);

    this.audioRef = React.createRef();
    this.videoRef = React.createRef();

    const { onUserAddMedia, onUserRemoveMedia } = props;

    onUserAddMedia((media) => {
      switch (media.mediakind) {
        case 'audio': {
          this.audioRef.current.srcObject = media.mediastream;
          break;
        }
        case 'video': {
          this.videoRef.current.srcObject = media.mediastream;
          break;
        }
        default:
      }
    });

    onUserRemoveMedia((media) => {
      switch (media.mediakind) {
        case 'audio': {
          this.audioRef.current.srcObject = null;
          break;
        }
        case 'video': {
          this.videoRef.current.srcObject = null;
          break;
        }
        default:
      }
    });
  }

  render() {
    // TODO: Render UID / display name
    return (
      <div className="media-container">
        <audio className="audio" autoPlay ref={this.audioRef} />
        <video className="video" autoPlay ref={this.videoRef} />
      </div>
    );
  }
}

Video.propTypes = {
  uid: PropTypes.string.isRequired,
  onUserAddMedia: PropTypes.func.isRequired,
  onUserRemoveMedia: PropTypes.func.isRequired,

  displayName: PropTypes.string,
};

export default Video;
