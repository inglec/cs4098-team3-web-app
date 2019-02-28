import io from 'socket.io-client';
import { Room as MediasoupRoom } from 'mediasoup-client';

import Peer from './Peer';
/*
  Events:
    -- When the room closes (locally or remotely)
    room-close: {}

    -- When a new user joins the room
    room-userconnect: {user}

    => See Peer.js for events that can be listened for on object 'user'
*/

class Room {
  constructor() {
    // super();
    this.msRoom = new MediasoupRoom();
    this.peers = new Map();
    this.socket = null;
    this.muted = false;
    this.transports = {
      send: null,
      recv: null,
    };

    // Events that can listened for
    this.listeners = {
      'room-close': [],
      'room-userconnect': [],
    };

    // Connect event listeners
    this.msRoom.on('close', () => this.onRoomClose());
    this.msRoom.on('newpeer', mediasoupPeer => this.onRoomNewPeer(mediasoupPeer));
    this.msRoom.on('request', ...args => this.onRoomRequest(...args));
    this.msRoom.on('notify', notification => this.onRoomNotify(notification));
  }

  join(client) {
    // Create a query
    const { url, uid, token } = client;
    const query = { uid, token };

    // Connect our local and remote room through a socket
    this.socket = io(url, { query });

    // Establish callback for notifications through socket
    this.socket.on('mediasoup-notification', (notification) => {
      this.socketOnNotification(notification);
    });

    // Join the room
    return this.msRoom.join(uid)
      .then((otherPeers) => {
        // Create transports , TODO: see if this can be done before joining as room
        this.transports.send = this.msRoom.createTransport('send');
        this.transports.recv = this.msRoom.createTransport('recv');

        // Setup all the handles for every other peer already in the room
        otherPeers.forEach(mediasoupPeer => this.onRoomNewPeer(mediasoupPeer));

        // Get our user media as a promise
        return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      })
      .then((mediastream) => {
        // Create producers for both video and audio
        const audio = mediastream.getAudioTracks()[0];
        const video = mediastream.getVideoTracks()[0];
        const audioProducer = this.msRoom.createProducer(audio);
        const videoProducer = this.msRoom.createProducer(video);

        // Send our produced video over send transport to the remote room
        audioProducer.send(this.transports.send);
        videoProducer.send(this.transports.send);
      });
  }

  leave() {
    this.msRoom.leave();
  }

  on(eventname, callback) {
    if (Array.isArray(this.listeners[eventname])) {
      this.listeners[eventname].push(callback);
    } else {
      console.debug('Unrecognized event for Peer : ', eventname);
    }
    return this;
  }

  emit(eventname, obj) {
    if (Array.isArray(this.listeners[eventname])) {
      this.listeners[eventname].forEach(cb => cb(obj));
    } else {
      console.debug('Unrecognized event for Peer : ', eventname);
    }
  }

  sendMessage(message) {
    // TODO
    console.debug('message: ', message);
  }

  toggleMute() {
    this.muted = !this.muted;
  }

  isMuted() {
    return this.muted;
  }

  onSocketNotification(notification) {
    console.debug('Notification recieved:', notification);
    this.msRoom.receiveNotification(notification);
  }

  onRoomClose() {
    // Probably best to just close socket and create a new Room if needed
    this.emitRoomclose();
    this.socket.close();
  }

  onRoomNewPeer(newpeer) {
    // Create a new peer and add it to the list
    const peer = new Peer(newpeer, this);
    this.peers.set(peer.uid, peer);

    // Set up callback and for when 'user-disconnect' and emit 'room-userconenct'
    peer.on('user-disconnect', ({ uid }) => this.peers.delete(uid));
    this.emit('room-userconnect', peer);
  }

  onRoomRequest(request, callback, errback) {
    console.debug('Request sent:', request);
    this.socket.emit('mediasoup-request', request, (err, response) => {
      if (err) {
        console.debug('Error recieved from request:', err);
        errback(err);
      } else {
        console.debug('Response recieved from request:', response);
        callback(response);
      }
    });
  }

  onRoomNotify(notification) {
    this.socket.emit('mediasoup-notification', notification);
  }
}

export default Room;
