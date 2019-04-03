import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class Media extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      audioMedia: null,
      videoMedia: null,
    };

    this.audioRef = null;
    this.videoRef = null;

    const { onUserAddMedia, onUserRemoveMedia } = props;

    // Register callbacks with Room
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
    const { onLoadMetadata } = this.props;

    if (ref) {
      const { videoMedia } = this.state;

      // eslint-disable-next-line no-param-reassign
      ref.srcObject = videoMedia;

      /**
       * After `srcObject` is added to the <video> element, there is a short period of time
       * where videoHeight and videoWidth will change. We need to listen for this and update.
       */
      ref.addEventListener('loadedmetadata', onLoadMetadata);
    } else {
      this.videoRef.removeEventListener('loadedmetadata', onLoadMetadata);
    }

    this.videoRef = ref;
  }

  render() {
    const { audioMedia, videoMedia } = this.state;

    /* eslint-disable jsx-a11y/media-has-caption */
    return (
      <div className="media-container">
        {audioMedia ? <audio autoPlay ref={ref => this.setAudioRef(ref)} /> : null}
        {videoMedia ? <video autoPlay ref={ref => this.setVideoRef(ref)} /> : null}
      </div>
    );
  }
}

Media.propTypes = {
  onLoadMetadata: PropTypes.func,
  onUserAddMedia: PropTypes.func,
  onUserRemoveMedia: PropTypes.func,
};

Media.defaultProps = {
  onLoadMetadata: () => {},
  onUserAddMedia: () => {},
  onUserRemoveMedia: () => {},
};

export default Media;
