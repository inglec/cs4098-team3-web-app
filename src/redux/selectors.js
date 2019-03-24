import { mapValues } from 'lodash/object';
import { createSelector } from 'reselect';

export const getAuth = state => state.auth;

// REVIEW: Tried to change to 'getChats' and 'state.chats' to reflect
// that it's an array of chats but I couldn't get it to work for redux
// Likewise getChatUsers is a little misleading, getChatsUsers?

export const getChat = state => state.chat;

export const getSessions = state => state.sessions;

// Array of unique users in chat for each session
export const getChatUsers = createSelector(
  getChat,
  chats => (
    mapValues(chats, (session) => {
      const uids = new Set();
      session.forEach(message => uids.add(message.sender));

      return Array.from(uids);
    })
  ),
);

// Might not be the correct way to do it
// But the other options are index into them in mapStateToProps or in the component
// Here it's more reusable
export const getSessionMessages = (state, sessionId) => state.chat[sessionId];

export const getSessionUsers = (state, sessionId) => getChatUsers(state)[sessionId];
