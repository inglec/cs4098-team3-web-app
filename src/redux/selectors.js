import { mapValues, pickBy } from 'lodash/object';
import { createSelector } from 'reselect';

export const getAuth = state => state.auth;

export const getChat = state => state.chat;

export const getGroups = state => state.groups;

export const getSessions = state => state.sessions;

export const getUsers = state => state.users;

export const getUser = createSelector(getUsers, getAuth, (users, { uid }) => users[uid]);

// Array of unique users in chat for each session
export const getChatUsers = createSelector(getChat, chat => (
  mapValues(chat, (session) => {
    const uids = new Set();
    session.forEach(message => uids.add(message.sender));

    return Array.from(uids);
  })
));

export const getSessionMessages = (state, sessionId) => state.chat[sessionId] || [];

export const getSessionUsers = (state, sessionId) => getChatUsers(state)[sessionId] || [];

export const getActiveSessions = createSelector(getSessions, sessions => (
  pickBy(sessions, ({ endTime, startTime }) => startTime < new Date().getTime() && !endTime)
));

export const getPastSessions = createSelector(getSessions, sessions => (
  pickBy(sessions, ({ endTime }) => endTime < new Date().getTime())
));

export const getFutureSessions = createSelector(getSessions, sessions => (
  pickBy(sessions, ({ startTime }) => startTime > new Date().getTime())
));
