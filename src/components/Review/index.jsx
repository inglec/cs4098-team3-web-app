// import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Video from './Video';
import Note from './Note';
import Profile from './Profile';

import './styles';

const VideoReview = () => (
  <div className="page review">
    <Video />
    <Note />
    <Profile />
  </div>
);

export default VideoReview;
