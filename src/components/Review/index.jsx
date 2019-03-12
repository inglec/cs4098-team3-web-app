import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { patientsByGroup, getVideoSrcById } from 'app-utils/requests';

import Video from './Video';
import Note from './Note';
import Profile from './Profile';

import './styles';

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      videoSrc: null,
    };

    // Promise: Get video src for the review
    getVideoSrcById(props.videoId)
      .then((videoSrc) => {
        this.setState({ videoSrc });
      })
      .catch((error) => {
        // Display some error, video not found
        console.error(error);
      });

    patientsByGroup(props.groupId)
      .then((patients) => {
        this.setState({ patients });
      })
      .catch((error) => {
        // Display some error, patients not found
        console.error(error);
      });
  }

  render() {
    const { videoSrc, patients } = this.state;
    return (
      <div className="review">

        <div className="review-video">
          <Video
            videoSrc={videoSrc}
          />
        </div>

        <div className="review-notes">
          <Note />
        </div>

        <div className="review-profiles">
          {
            _.map(patients, patientProfile => (
              <Profile
                key={patientProfile.uid}
                profile={patientProfile}
              />
            ))
          }
        </div>

      </div>
    );
  }
}

Review.propTypes = {
  videoId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};

export default Review;
