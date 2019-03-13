import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

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
      notesOpen: false,
      patientsPresent: 0,
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
        // Definitely a better way to do this (reduce)
        let patientsPresent = 0;
        patients.forEach((patient) => {
          if (patient.present) {
            patientsPresent += 1;
          }
        });
        this.setState({ patients, patientsPresent });
      })
      .catch((error) => {
        // Display some error, patients not found
        console.error(error);
      });
  }

  render() {
    const {
      videoSrc, patients, notesOpen, patientsPresent,
    } = this.state;

    return (
      <div className="review">

        <div className="mainview">
          <Jumbotron className="video-container">
            <Video
              videoSrc={videoSrc}
            />
          </Jumbotron>

          <div className="bottom">

            <div className="profiles">
              {
                _.map(patients, patientProfile => (
                  <Profile
                    key={patientProfile.uid}
                    profile={patientProfile}
                    patientsPresent={patientsPresent}
                  />
                ))
              }
            </div>

            <div className="notes-button-container">
              <Button
                onClick={() => this.setState({ notesOpen: !notesOpen })}
                className="notes-button"
                variant="outline-secondary"
              >
                Notes
              </Button>
            </div>

          </div>

        </div>

        <Collapse timeout={300} in={notesOpen}>
          <div className="notes">
            <Note />
          </div>
        </Collapse>

      </div>
    );
  }
}

Review.propTypes = {
  videoId: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};

export default Review;
