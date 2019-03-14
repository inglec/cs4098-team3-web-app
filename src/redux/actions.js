import { authenticate } from 'app-utils/requests';

// Action types.
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';
export const LOG_IN_STARTED = 'LOG_IN_STARTED';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

export const createAction = (type, fields = {}) => ({
  type,
  ...fields,
});

// Actions.
export const addChatMessage = (sessionId, sender, text, timestamp) => (
  createAction(ADD_CHAT_MESSAGE, ({
    sender,
    sessionId,
    text,
    timestamp,
  }))
);

const logInStarted = (uid, password) => createAction(LOG_IN_STARTED, { uid, password });
const logInSuccess = (uid, token) => createAction(LOG_IN_SUCCESS, { uid, token });
const logInFailure = error => createAction(LOG_IN_FAILURE, { error });

export const logOut = () => createAction(LOG_OUT);

export const logIn = (uid, password) => (
  (dispatch) => {
    dispatch(logInStarted(uid, password));

    authenticate(uid, password)
      .then(response => dispatch(logInSuccess(uid, response)))
      .catch(error => dispatch(logInFailure(error)));
  }
);
