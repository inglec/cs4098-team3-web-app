export const CLOSE = 'close';
export const NEW_CONSUMER = 'newconsumer';
export const NEW_PEER = 'newpeer';
export const REQUEST = 'request';
export const NOTIFY = 'notify';

export const MEDIASOUP_NOTIFICATION = 'mediasoup-notification';
export const MEDIASOUP_REQUEST = 'mediasoup-request';

export const METHOD_CHAT_MESSAGE = 'chat-message';
/**
 * Events:
 * - When the room closes (locally or remotely)
 *   room-close: {}
 *
 * - When a new user joins the room
 *   room-userconnect: { user }
 *
 * - When a new chat message is sent into the room
 *   room-chat-message
 */

export const ROOM_CLOSE = 'room-close';
export const ROOM_USER_CONNECT = 'room-userconnect';
export const ROOM_CHAT_MESSAGE = 'room-chat-message';

/**
 * Events:
 * - When this user disconnects
 *   user-disconnect: { uid }
 *
 * - When this user adds media that we are receiving
 *   user-addmedia: { uid, mediakind, mediastream }
 *
 * - When this user stops streaming to us or we stop receiving
 *   user-removemedia: { uid, mediakind }
 */

export const USER_ADD_MEDIA = 'user-addmedia';
export const USER_DISCONNECT = 'user-disconnect';
export const USER_REMOVE_MEDIA = 'user-removemedia';
