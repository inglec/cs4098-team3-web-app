import io from 'socket.io-client';
import mediasoupClient from 'mediasoup-client';

import Peer from './Peer';
/*
  Events:
    -- When the room closes (locally or remotely)
    room-close: {}

    -- When a new user joins the room
    room-newuser: {user}

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
    this.mediasouproom = mediasoupClient.Room();
    this.peers = new Map();
    this.socket = null;
    this.muted = false;
    this.listeners = {
      roomclose: [],
      roomnewuser: [],
    };

    // Socket Event handles
    this.onSocketNotification = this.onSocketNotification.bind(this);

    // Local Room Event Handles
    this.onRoomClose = this.onRoomClose.bind(this);
    this.onRoomNewPeer = this.onRoomNewPeer.bind(this);
    this.onRoomRequest = this.onRoomRequest.bind(this);
    this.onRoomNotify = this.onRoomNotify.bind(this);

    // Connect event listeners
    this.mediasouproom.on('close', this.onRoomClose);
    this.mediasouproom.on('newpeer', this.onRoomNewPeer);
    this.mediasouproom.on('request', this.onRoomRequest);
    this.mediasouproom.on('notify', this.onRoomNotify);
  }

  join(url, user, token) {
    // Create a query
    const query = { ...user, token };

    // Connect our local and remote room through a socket
    this.socket = io(url, query);
    this.socket.on('mediasoup-notification', this.socketOnNotification);

    // Join the room
    this.mediasouproom.join(user.username)
      .then((otherPeers) => {
        // Create transports , TODO: see if this can be done before joining as room
        this.transports.send = this.mediasouproom.createTransport('send');
        this.transports.recv = this.mediasouproom.createTransport('recv');

        // Setup all the handles for every other peer already in the room
        otherPeers.forEach(mediasoupPeer => this.onRoomNewPeer(mediasoupPeer));

        // Get our user media TODO: find out what happens if the reject
        const mediastream = navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        // Create producers for both video and audio
        const audio = mediastream.getAudioTracks()[0];
        const video = mediastream.getVideoTracks()[0];
        const audioProducer = this.mediasouproom.createProducer(audio);
        const videoProducer = this.mediasouproom.createProducer(video);

        // Send our produced video over send transport to the remote room
        audioProducer.send(this.transports.send);
        videoProducer.send(this.transports.send);

        // REVIEW: is this correct?
        return Promise.resolve();
      })
      // TODO: probably some errors I should deal with here
      .catch(error => Promise.reject(error));
  }

  leave() {
    this.mediasouproom.leave();
  }

  emit(eventname, obj) {
    this.listeners[eventname].forEach(cb => cb(obj));
  }

  on(eventname, callback) {
    switch (eventname) {
      case 'room-close':
        this.listeners.roomclose.append(callback);
        break;
      case 'room-newuser':
        this.listeners.roomnewusers.append(callback);
        break;
      default:
        console.debug('Unrecognized event for Room : ', eventname);
    }
  }

  sendMessage() {
    // TODO
    console.debug('message');
  }

  tick() {
    // TODO
    console.debug('tick');
  }

  mute() { this.muted = true; }

  toggleMute() { this.muted = !this.muted; }

  isMuted() { return this.muted; }

  onSocketNotification(notification) {
    this.mediasouproom.receiveNotification(notification);
  }

  onRoomClose() {
    // Not fully sure how much to clean up
    // probably best to just create a new Room and close socket
    this.emitRoomclose();
    this.socket.close();
  }

  onRoomNewPeer(newpeer) {
    const peer = new Peer(newpeer);
    this.peers.set(peer.name, peer);
    peer.on('user-disconnect', ({ username }) => this.peers.delete(username));
    this.emitRoomnewuser({ user: peer });
  }

  onRoomRequest(request, callback, errback) {
    this.socket.emit('mediasoup-request', request, (err, response) => {
      if (err) errback(err);
      else callback(response);
    });
  }

  onRoomNotify(notification) {
    this.socket.emit('mediasoup-notification', notification);
  }
}

export default Room;
