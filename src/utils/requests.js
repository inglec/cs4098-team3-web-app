// import axios from 'axios';

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
