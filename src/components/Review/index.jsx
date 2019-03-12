import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { patients } from 'app-root/data/test/patients';

import Video from './Video';
import Note from './Note';
import Profile from './Profile';

import './styles';


/* Demo Variables */
const videoSrc = 'https://www.sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4';

const dummyPic = 'app-root/data/test/nopic.png'


class Review extends React.Component {
  constructor(props) {
    super(props);

    // this.patients = props.patients
    // this.videoSrc = props.videoSrc

    // For demo
    this.patients = patients;
    this.videoSrc = videoSrc;
    this.patients.forEach(p => {
      p.image = dummyPic
    });

  }

  render() {
    return (
      <div className="review">

        <div className="review-video">
          <Video
            src={this.videoSrc}
          />
        </div>

        <div className="review-notes">
          <Note />
        </div>

        <div className="review-profiles">
          {
            _.map(this.patients, profile => (
              <Profile
                key={profile.uid}
                profile={profile}
              />
            ))
          }
        </div>

      </div>
    );
  }
}

export default Review;
