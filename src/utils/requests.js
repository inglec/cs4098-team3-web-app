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

// TODO: Actually send POST request to API server
export const updateProfile = (token, fields) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token && fields) {
        resolve();
      } else {
        reject(Error('missing fields'));
      }
    }, 500);
  })
);
