import React from 'react';

/*
  Might need to be a class for functionality purposes
*/
const Video = props => (
  <div className="review-video">
    <h1>I am video</h1>
    <audio className="audio" src={props.audio} />
    <video className="video" src={props.video} />
  </div>
);

export default Video;
