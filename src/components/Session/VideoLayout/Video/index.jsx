/* eslint-disable jsx-a11y/media-has-caption */

import PropTypes from 'prop-types';
import React, { Component, createRef } from 'react';

import './styles';

class Video extends Component {
  constructor(props) {
    super(props);

    this.audioRef = createRef();
    this.videoRef = createRef();

    const { onUserAddMedia, onUserRemoveMedia } = props;

    onUserAddMedia(({ mediakind, mediastream }) => {
      switch (mediakind) {
        case 'audio': {
          this.setState({ audioMedia: mediastream });
          break;
        }
        case 'video': {
          this.setState({ videoMedia: mediastream });
          break;
        }
        default:
      }
    });

    onUserRemoveMedia(({ mediakind }) => {
      switch (mediakind) {
        case 'audio': {
          this.setState({ audioMedia: null });
          break;
        }
        case 'video': {
          this.setState({ videoMedia: null });
          break;
        }
        default:
      }
    });

    this.state = {
      audioMedia: null,
      videoMedia: null,
    };
  }

  setAudioRef(ref) {
    if (ref) {
      const { audioMedia } = this.state;

      // eslint-disable-next-line no-param-reassign
      ref.srcObject = audioMedia;
    }

    this.audioRef = ref;
  }

  setVideoRef(ref) {
    if (ref) {
      const { videoMedia } = this.state;

      // eslint-disable-next-line no-param-reassign
      ref.srcObject = videoMedia;
    }

    this.videoRef = ref;
  }

  render() {
    const { audioMedia, videoMedia } = this.state;
    const { setRef } = this.props;

    // TODO: Render UID / display name
    return (
      <div className="media-container" ref={ref => setRef(ref)}>
        {audioMedia ? <audio autoPlay ref={ref => this.setAudioRef(ref)} /> : null}
        {videoMedia ? <video autoPlay ref={ref => this.setVideoRef(ref)} /> : null}
      </div>
    );
  }
}

Video.propTypes = {
  uid: PropTypes.string.isRequired,
  onUserAddMedia: PropTypes.func.isRequired,
  onUserRemoveMedia: PropTypes.func.isRequired,

  displayName: PropTypes.string,
  setRef: PropTypes.func,
};

Video.defaultProps = {
  displayName: '',
  setRef: () => {},
};

export default Video;
