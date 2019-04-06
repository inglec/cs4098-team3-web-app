import { Room as MediasoupRoom } from 'mediasoup-client';
import io from 'socket.io-client';

import {
  CLOSE,
  NEW_PEER,
  MEDIASOUP_NOTIFICATION,
  MEDIASOUP_REQUEST,
  NOTIFY,
  REQUEST,
  ROOM_CLOSE,
  ROOM_USER_CONNECT,
  USER_DISCONNECT,
} from './events';
import Peer from './Peer';

class Room {
  constructor() {
    this.msRoom = new MediasoupRoom();
    this.peers = new Map();
    this.socket = null;
    this.isMuted = false;
    this.transports = { recv: null, send: null };
    this.mediastream = null;

    // Events that can be listened for
    this.listeners = {
      [ROOM_CLOSE]: [],
      [ROOM_USER_CONNECT]: [],
    };

    // Connect event listeners
    this.msRoom.on(CLOSE, () => this.onRoomClose());
    this.msRoom.on(NEW_PEER, mediasoupPeer => this.onRoomNewPeer(mediasoupPeer));
    this.msRoom.on(NOTIFY, notification => this.onRoomNotify(notification));
    this.msRoom.on(REQUEST, (request, callback, errback) => (
      this.onRoomRequest(request, callback, errback)
    ));
  }

  join(url, uid, token) {
    // Connect our local and remote room through a socket
    this.socket = io(url, { query: { uid, token } });
    this.socket.on(MEDIASOUP_NOTIFICATION, notification => (
      this.msRoom.receiveNotification(notification)
    ));

    // Join the room
    return this.msRoom.join(uid)
      .then((peers) => {
        this.transports = {
          recv: this.msRoom.createTransport('recv'),
          send: this.msRoom.createTransport('send'),
        };

        // Setup all the handles for every other peer already in the room
        peers.forEach(peer => this.onRoomNewPeer(peer));
      })
      .then(() => (
        // Get our user media as a promise
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      ))
      .then((mediastream) => {
        this.mediastream = mediastream;

        // Create references to mediastreams which may be assigned to if tracks exist
        let audioStream = null;
        let videoStream = null;

        const audioTracks = mediastream.getAudioTracks();
        const videoTracks = mediastream.getVideoTracks();
        // Process audio and video tracks if any
        // https://stackoverflow.com/questions/24403732/check-if-array-is-empty-or-does-not-exist-js
        if (Array.isArray(audioTracks) && audioTracks.length) {
          const audio = mediastream.getAudioTracks()[0];
          const audioProducer = this.msRoom.createProducer(audio);
          audioProducer.send(this.transports.send);
          audioStream = new MediaStream();
          audioStream.addTrack(audio);
        }

        if (Array.isArray(videoTracks) && videoTracks.length) {
          const video = mediastream.getVideoTracks()[0];
          const videoProducer = this.msRoom.createProducer(video);
          videoProducer.send(this.transports.send);
          videoStream = new MediaStream();
          videoStream.addTrack(video);
        }

        return Promise.resolve({ audioStream, videoStream });
      });
  }

  leave() {
    this.msRoom.leave();
    if (this.mediastream) {
      this.mediastream.getTracks().forEach(track => track.stop());
    }
  }

  on(eventName, callback) {
    if (eventName in this.listeners) {
      this.listeners[eventName].push(callback);
    }
    return this;
  }

  emit(eventName, ...args) {
    if (eventName in this.listeners) {
      this.listeners[eventName].forEach(callback => callback(...args));
    }
  }

  // eslint-disable-next-line
  sendMessage(message) {
    // TODO
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    return this.isMuted;
  }

  onRoomClose() {
    // Probably best to just close socket and create a new Room if needed
    // this.emitRoomClose();
    this.socket.close();
  }

  onRoomNewPeer(mediasoupPeer) {
    // Create a new peer and add it to the list
    const peer = new Peer(mediasoupPeer, this.transports);
    this.peers.set(peer.uid, peer);

    // Set up callback and for when 'user-disconnect' and emit 'room-userconnect'
    peer.on(USER_DISCONNECT, user => this.peers.delete(user.uid));
    this.emit(ROOM_USER_CONNECT, peer);
  }

  onRoomRequest(request, callback, errback) {
    this.socket.emit(MEDIASOUP_REQUEST, request, (err, response) => {
      if (err) {
        errback(err);
      } else {
        callback(response);
      }
    });
  }

  onRoomNotify(notification) {
    this.socket.emit(MEDIASOUP_NOTIFICATION, notification);
  }
}

export default Room;
