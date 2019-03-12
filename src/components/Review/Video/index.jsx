import React from 'react';

/*
  Might need to be a class for functionality purposes
*/
const Video = ({ videoSrc }) => (
  <div className="review-video">
    <video className="video" width="640" height="480" loop autoPlay controls>
      <source src={videoSrc} type="video/mp4" />
      <source src={videoSrc} type="video/ogg" />
    </video>

  </div>
);

export default Video;
