import { authenticate, updateProfile as updateUserProfile } from 'app-utils/requests';

// Action types.
export const ADD_CHAT_MESSAGE = 'ADD_CHAT_MESSAGE';
export const LOG_IN_STARTED = 'LOG_IN_STARTED';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';
export const UPDATE_PROFILE_STARTED = 'UPDATE_PROFILE_STARTED';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE';

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

const logInStarted = () => createAction(LOG_IN_STARTED);
const logInSuccess = (uid, token) => createAction(LOG_IN_SUCCESS, { uid, token });
const logInFailure = error => createAction(LOG_IN_FAILURE, { error });

export const logOut = () => createAction(LOG_OUT);

export const logIn = (uid, password) => (
  (dispatch) => {
    dispatch(logInStarted());

    authenticate(uid, password)
      .then(response => dispatch(logInSuccess(uid, response)))
      .catch(error => dispatch(logInFailure(error)));
  }
);

const updateProfileStarted = () => createAction(UPDATE_PROFILE_STARTED);
const updateProfileSuccess = () => createAction(UPDATE_PROFILE_SUCCESS);
const updateProfileFailure = error => createAction(UPDATE_PROFILE_FAILURE, { error });

export const updateProfile = (token, fields) => (
  (dispatch) => {
    dispatch(updateProfileStarted());

    updateUserProfile(token, fields)
      .then(() => dispatch(updateProfileSuccess()))
      .catch(error => dispatch(updateProfileFailure({ error })));
  }
);
