import { combineReducers } from 'redux';

import {
  LOG_IN_FAILURE,
  LOG_IN_STARTED,
  LOG_IN_SUCCESS,
  LOG_OUT,
} from './actions';

// Data states.
const LOADING = 'LOADING';
const LOADED = 'LOADED';

const setDataState = (status, data) => ({
  status,
  ...data,
});

const auth = (state = {}, action) => {
  switch (action.type) {
    case LOG_IN_STARTED:
      return setDataState(LOADING);
    case LOG_IN_SUCCESS:
      return setDataState(LOADED, {
        username: action.username,
        token: action.token,
      });
    case LOG_IN_FAILURE:
      return setDataState(LOADED, { error: action.error.message });
    case LOG_OUT:
      return setDataState(LOADED);
    default:
      return state;
  }
};

export default combineReducers({ auth });
