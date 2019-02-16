// import axios from 'axios';

// TODO
// const AUTH_SERVER_URL = 'https://';

// TODO: Actually do authentication.
export const authenticate = (username, password) => (
  // axios.post(AUTH_SERVER_URL, { username, password })
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username && password) {
        resolve('testtoken');
      } else {
        reject(Error('bad credentials'));
      }
    }, 2000);
  })
);
