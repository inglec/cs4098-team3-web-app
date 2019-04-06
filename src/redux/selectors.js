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
  chats => (
    mapValues(chats, (chat) => {
      const uids = new Set();
      chat.forEach(message => uids.add(message.sender));

      return Array.from(uids);
    })
  ),
);

export const getSessionMessages = (state, sessionId) => state.chat[sessionId] || [];

export const getSessionUsers = (state, sessionId) => getChatUsers(state)[sessionId] || [];
