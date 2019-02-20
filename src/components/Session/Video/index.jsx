import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './styles';

class Video extends Component {
  constructor(props) {
    super(props);

    this.audioRef = React.createRef();
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    // this.audioRef.current.play();
    // this.videoRef.current.play();
  }

  render() {
    const {
      audioStream,
      mute,
      tick,
      username,
      videoStream,
    } = this.props;

    return (
      <video className="video" ref={this.videoRef}>
        <source src={videoStream} />
      </video>
    );
  }
}

Video.propTypes = {
  audioStream: PropTypes.object.isRequired,
  mute: PropTypes.func.isRequired,
  tick: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  videoStream: PropTypes.object.isRequired,
};

export default Video;
