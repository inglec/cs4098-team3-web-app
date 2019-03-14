import { mapValues } from 'lodash/object';
import { createSelector } from 'reselect';

export const getAuth = state => state.auth;

export const getChat = state => state.chat;

// Array of unique UIDs in chat for each session
export const getChatUsers = createSelector(
  getChat,
  chat => (
    mapValues(chat, (session) => {
      const uids = new Set();
      session.forEach(message => uids.add(message.uid));

      return Array.from(uids);
    })
  ),
);
