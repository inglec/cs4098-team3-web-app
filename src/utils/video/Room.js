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

/*
  REVIEW:
    Need to consider async when emitting events, might be relevant
    See about bable having arrow function syntax for autobinding
     - LINK: https://medium.com/quick-code/react-quick-tip-use-class-properties-and-arrow-functions-to-avoid-binding-this-to-methods-29628aca2e25
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

    // Socket Event handles
    this.onSocketNotification = this.onSocketNotification.bind(this);

    // Local Room Event Handles
    this.onRoomClose = this.onRoomClose.bind(this);
    this.onRoomNewPeer = this.onRoomNewPeer.bind(this);
    this.onRoomRequest = this.onRoomRequest.bind(this);
    this.onRoomNotify = this.onRoomNotify.bind(this);

    // Connect event listeners
    this.msRoom.on('close', this.onRoomClose);
    this.msRoom.on('newpeer', this.onRoomNewPeer);
    this.msRoom.on('request', this.onRoomRequest);
    this.msRoom.on('notify', this.onRoomNotify);
  }

  join(client) {
    // Create a query
    const { url, uid, token } = client;
    const query = { uid, token };

    // Connect our local and remote room through a socket
    this.socket = io(url, { query });
    this.socket.on('mediasoup-notification', this.socketOnNotification);

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
    // Not fully sure how much to clean up.
    // Probably best to just create a new Room and close socket.
    this.emitRoomclose();
    this.socket.close();
  }

  onRoomNewPeer(newpeer) {
    const peer = new Peer(newpeer, this);
    this.peers.set(peer.uid, peer);
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
