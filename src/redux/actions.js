import { authenticate } from 'app-utils/requests';

// Action types.
export const LOG_IN_STARTED = 'LOG_IN_STARTED';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export const createAction = (type, fields = {}) => ({
  type,
  ...fields,
});

// Actions.
const logInStarted = (username, password) => createAction(LOG_IN_STARTED, { username, password });
const logInSuccess = (username, token) => createAction(LOG_IN_SUCCESS, { username, token });
const logInFailure = error => createAction(LOG_IN_FAILURE, { error });

export const logOut = () => createAction(LOG_OUT);

export const logIn = (username, password) => (
  (dispatch) => {
    dispatch(logInStarted(username, password));

    authenticate(username, password)
      .then(response => dispatch(logInSuccess(username, response)))
      .catch(error => dispatch(logInFailure(error)));
  }
);
