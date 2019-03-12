// import axios from 'axios';
import { patients } from 'app-root/data/test/patients';

const videoSrc = 'http://localhost:8080/data/test/small.mp4';
const defaultPicSrc = 'http://localhost:8080/data/test/nopic.png';
// TODO
// const AUTH_SERVER_URL = 'https://';

// TODO: Actually do authentication.
export const authenticate = (uid, password) => (
  // axios.post(AUTH_SERVER_URL, { uid, password })
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (uid && password) {
        resolve('testtoken');
      } else {
        reject(Error('bad credentials'));
      }
    }, 2000);
  })
);

export const patientsByGroup = groupId => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        // Linter doesn't seem to like forEach for changing values
        patients.forEach((patient) => {
          if (!patient.imageSrc) {
            patient.imageSrc = defaultPicSrc;
          }
        });
        resolve(patients);
      } else {
        reject(Error(`Could not retrieve patients for group ${groupId}`));
      }
    }, 500);
  })
);

export const getVideoSrcById = videoId => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        resolve(videoSrc);
      } else {
        reject(Error(`Could not retrieve video for videoId ${videoId}`));
      }
    }, 500);
  })
);
