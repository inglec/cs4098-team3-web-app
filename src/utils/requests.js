// import axios from 'axios';

// TODO
// const AUTH_SERVER_URL = 'https://';

// TODO: Actually do authentication.
export const authenticate = (username, password) => (
  // axios.post(AUTH_SERVER_URL, { username, password })
  username && password
    ? Promise.resolve('testtoken')
    : Promise.reject(Error('bad credentials'))
);
