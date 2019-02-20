import { combineReducers } from 'redux';

import {
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

const auth = (state = { username: 'test', token: 'testtoken' }, action) => {
  switch (action.type) {
    case LOG_IN_STARTED:
      return createDataState(LOADING);
    case LOG_IN_SUCCESS:
      return createDataState(LOADED, {
        username: action.username,
        token: action.token,
      });
    case LOG_IN_FAILURE:
      return createDataState(LOADED, { error: action.error.message });
    case LOG_OUT:
      return createDataState(LOADED);
    default:
      return state;
  }
};

export default combineReducers({ auth });
