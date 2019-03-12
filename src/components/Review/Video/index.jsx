import React from 'react';

/*
  Might need to be a class for functionality purposes
*/
const Video = ({ videoSrc }) => (
  <div className="review-video">
    <video key={videoSrc} className="video" controls>
      <source src={videoSrc} type="video/mp4" />
    </video>

  </div>
);


export default Video;
