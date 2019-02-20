import io from 'socket.io-client';
import mediasoupClient from 'mediasoup-client';

import MediaSource from './MediaSource';

class Room extends EventTarget {
  constructor(url) {
    super();
    this.url = url;
    this.mediasoupRoom = mediasoupClient.Room();
    this.remoteSources = new Map();
    this.transports = {
      send: null,
      recv: null,
    };
    this.socket = null;

    this.peerSetup = this.peerSetup.bind(this);
    this.consumerSetup = this.consumerSetup.bind(this);
    this.notifyHandler = this.notifyHandler.bind(this);
    this.requestHandler = this.requestHandler.bind(this);

    this.mediasoupRoom.on('newpeer', this.peerSetup);
    this.mediasoupRoom.on('notify', this.notifyHandler);
    this.mediasoupRoom.on('request', this.requestHandler);
  }

  getStreams() {
    return this.remoteSources.values();
  }

  join(user, callback) {
    // TODO: Will have to obtain some auth token from a secure location
    const token = 'abc';
    const query = { ...user, token };
    this.socket = io(this.url, { ...query });
    this.socket.on('mediasoup-notification', (notification) => {
      this.mediasoupRoom.receiveNotification(notification);
    });

    // Join the local representation of the room
    this.mediasoupRoom.join(user.peerId)
      .then((peers) => {
        // Create transports and setup connections to other peers if any
        this.transports.send = this.mediasoupRoom.createTransport('send');
        this.transports.recv = this.mediasoupRoom.createTransport('recv');
        peers.forEach((peer) => {
          this.peerSetup(peer);
          peer.consumers.forEach(consumer => this.consumerSetup(consumer));
        });
      })
      .then(() => {
        // Get user media streams
        const mediaStream = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const audio = mediaStream.getAudioTracks()[0];
        const video = mediaStream.getVideoTracks()[0];
        return { audio, video };
      })
      .then(({ audio, video }) => {
        // Create Producers and direct them to stream over the Transports
        const audioProducer = this.mediasoupRoom.createProducer(audio);
        const videoProducer = this.mediasroomoupRoom.createProducer(video);
        audioProducer.send(this.transports.send);
        videoProducer.send(this.transports.send);
      })
      .then(() => {
        callback(null);
      })
      .catch((error) => {
        console.error(error);
        callback(error);
      });
  }

  peerSetup(peer) {
    peer.on('close', () => {
      // TODO: Make sure 'this' is indeed this (Room)
      // TODO: Change peer to be whatever the component needs to track state
      this.dispatchEvent(new CustomEvent('peer-close'), { peer });
      console.debug(`${peer.name} has left`);
    });
    peer.on('newconsumer', (consumer) => {
      console.debug('Got a new Remote Consumer');
      this.consumerSetup(consumer);
    });
  }

  consumerSetup(consumer) {
    consumer.on('close', () => console.debug('Consumer closed'));

    consumer.receive(this.transports.recv)
      .then((track) => {
        console.debug(`Receiving media stream: ${consumer.kind} from ${consumer.peer.name}`);
        if (!this.remoteSources.has(consumer.peer.id)) {
          this.remoteSources.set(consumer.peer.id, new MediaSource(consumer.peer));
        }

        const mediaSource = this.remoteSources.get(consumer.peer.id);
        if (consumer.kind === 'video') {
          mediaSource.addVideoTrack(track);
        }
        if (consumer.kind === 'audio') {
          mediaSource.addAudioTrack(track);
        }
      })
      .catch(err => console.error(err));
  }

  requestHandler(request, callback, errback) {
    console.debug('Req:', request);
    this.socket.emit('mediasoup-request', request, (err, response) => {
      if (!err) {
        callback(response);
      } else {
        errback(err);
      }
    });
  }

  notifyHandler(notification) {
    console.debug('Notification:', notification);
    this.socket.emit('mediasoup-notification', notification);
  }
}

export default Room;
