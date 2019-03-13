import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

import { patientsByGroup, getVideoById } from 'app-utils/requests';

import Video from './Video';
import LogMessage from './LogMessage';
import Profile from './Profile';

import './styles';

class Review extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      peoplePresent: 0,
      videoSrc: null,
      videoLog: [],
      notesOpen: false,
    };

    // Promise: Get video src for the review
    getVideoById(props.videoId)
      .then(({ videoSrc, videoLog }) => {
        this.setState({ videoSrc, videoLog });
      })
      .catch((error) => {
        // Display some error, video not found
        console.error(error);
      });

    patientsByGroup(props.groupId)
      .then((patients) => {
        // Definitely a better way to do this (reduce)
        let peoplePresent = 0;
        patients.forEach((patient) => {
          if (patient.present) {
            peoplePresent += 1;
          }
        });
        this.setState({ patients, peoplePresent });
      })
      .catch((error) => {
        // Display some error, patients not found
        console.error(error);
      });
  }

  render() {
    const {
      videoSrc, videoLog, patients, notesOpen, peoplePresent,
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
                    peoplePresent={peoplePresent}
                  />
                ))
              }
            </div>

            <div className="log-button-container">
              <Button
                onClick={() => this.setState({ notesOpen: !notesOpen })}
                className="log-button"
                variant="outline-secondary"
              >
                Session Log
              </Button>
            </div>

          </div>

        </div>

        <Collapse timeout={300} in={notesOpen}>
          <div className="log">
            <div className="log-messages">
              {
                _.map(videoLog, ({
                  type, sender, timestamp, message,
                }) => (
                  <LogMessage
                    key={timestamp}
                    type={type}
                    sender={sender}
                    timestamp={timestamp}
                    message={message}
                  />
                ))
              }
            </div>
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
