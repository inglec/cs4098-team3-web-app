import _ from 'lodash';
import { combineReducers } from 'redux';
import uuidv4 from 'uuid/v4';

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

// TODO: re-adjust uid to be null until logged in
const auth = (state = { uid: uuidv4(), token: 'testtoken' }, action) => {
  switch (action.type) {
    case LOG_IN_STARTED:
      return createDataState(LOADING);
    case LOG_IN_SUCCESS:
      return createDataState(LOADED, _.pick(action, ['token', 'uid']));
    case LOG_IN_FAILURE:
      return createDataState(LOADED, { error: action.error.message });
    case LOG_OUT:
      return createDataState(LOADED);
    default:
      return state;
  }
};

export default combineReducers({ auth });
