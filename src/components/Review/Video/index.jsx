import React from 'react';
import PropTypes from 'prop-types';

/*
  Might need to be a class for functionality purposes
*/
const Video = ({ videoSrc, height, width }) => (
  <div className="review-video">
    <video key={videoSrc} height={height} width={width} className="video" controls>
      <source src={videoSrc} type="video/mp4" />
    </video>

  </div>
);

// Linter doesn't like { ..., height=480, width=640 } form of optional params
// https://stackoverflow.com/questions/47774695/react-functional-component-default-props-vs-default-parameters
// Turns out these props will be checked against propTypes while default values wont
Video.defaultProps = {
  height: 480,
  width: 640,
};

Video.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default Video;
