import { sortBy } from 'lodash/collection';
import { combineReducers } from 'redux';

import {
  ADD_CHAT_MESSAGE,
  LOG_IN_FAILURE,
  LOG_IN_STARTED,
  LOG_IN_SUCCESS,
  LOG_OUT,
} from './actions';

// Data states.
export const LOADING = 'LOADING';
export const LOADED = 'LOADED';

const createDataState = (status, data) => ({
  status,
  ...data,
});

const auth = (state = {}, action) => {
  const {
    error,
    token,
    type,
    uid,
  } = action;

  switch (type) {
    case LOG_IN_STARTED:
      return createDataState(LOADING);
    case LOG_IN_SUCCESS:
      return createDataState(LOADED, { token, uid });
    case LOG_IN_FAILURE:
      return createDataState(LOADED, { error: error.message });
    case LOG_OUT:
      return createDataState(LOADED);
    default:
      return state;
  }
};

const chat = (state = {}, action) => {
  const {
    sender,
    sessionId,
    text,
    timestamp,
    type,
  } = action;

  switch (type) {
    case ADD_CHAT_MESSAGE: {
      const otherMessages = state[sessionId] || [];
      const newMessage = { sender, text, timestamp };
      const messages = [
        ...otherMessages,
        newMessage,
      ];

      return {
        ...state,
        [sessionId]: sortBy(messages, message => message.timestamp),
      };
    }
    default:
      return state;
  }
};

// TODO
const sessions = (state = {}) => state;

const users = (state = {}) => state;

export default combineReducers({
  auth,
  chat,
  sessions,
  users,
});
