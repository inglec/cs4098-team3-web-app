import { mapValues } from 'lodash/object';
import { createSelector } from 'reselect';

export const getAuth = state => state.auth;

export const getChat = state => state.chat;

export const getSessions = state => state.sessions;

export const getUsers = state => state.users;

export const getUser = createSelector(getUsers, getAuth, (users, { uid }) => users[uid]);

// Array of unique users in chat for each session
export const getChatUsers = createSelector(
  getChat,
  chat => (
    mapValues(chat, (session) => {
      const uids = new Set();
      session.forEach(message => uids.add(message.sender));

      return Array.from(uids);
    })
  ),
);
