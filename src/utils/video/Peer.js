import {
  CLOSE,
  NEW_CONSUMER,
  USER_ADD_MEDIA,
  USER_DISCONNECT,
  USER_REMOVE_MEDIA,
} from './events';

class Peer {
  constructor(msPeer, roomTransports) {
    this.msPeer = msPeer;
    this.uid = msPeer.name; // Mediasoup refers to it as `name`
    this.consumers = { audio: null, video: null };
    this.roomTransports = roomTransports;
    this.isMuted = false;

    // Events that can be listened for
    this.listeners = {
      [USER_ADD_MEDIA]: [],
      [USER_DISCONNECT]: [],
      [USER_REMOVE_MEDIA]: [],
    };

    // Setup event handlers
    this.msPeer.on(CLOSE, () => this.onClose());
    this.msPeer.on(NEW_CONSUMER, consumer => this.onNewConsumer(consumer));

    // Setup all consumers for this peer
    this.msPeer.consumers.forEach(consumer => this.onNewConsumer(consumer));
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    // Return the new muted status
    return this.isMuted;
  }

  // eslint-disable-next-line
  tick() {
    // TODO
  }

  on(eventName, callback) {
    if (eventName in this.listeners) {
      this.listeners[eventName].push(callback);
    }

    // Allow chaining
    return this;
  }

  emit(eventName, ...args) {
    if (eventName in this.listeners) {
      this.listeners[eventName].forEach(callback => callback(...args));
    }
  }

  onClose() {
    this.emit(USER_DISCONNECT, this.uid);
  }

  onNewConsumer(consumer) {
    // Receive the new consumer
    consumer.receive(this.roomTransports.recv)
      .then((track) => {
        // Add reference to this consumer
        switch (track.kind) {
          case 'audio':
            this.consumers.audio = track;
            break;
          case 'video':
            this.consumers.video = track;
            break;
          default:
        }

        // Emit that new media is being consumed
        const stream = new MediaStream();
        stream.addTrack(track);

        this.emit(USER_ADD_MEDIA, {
          uid: this.uid,
          mediakind: track.kind,
          mediastream: stream,
        });
      });

    consumer.on(CLOSE, () => {
      // Remove reference to this consumer
      switch (consumer.kind) {
        case 'audio':
          this.consumers.audio = null;
          break;
        case 'video':
          this.consumers.video = null;
          break;
        default:
      }

      this.emit(USER_REMOVE_MEDIA, {
        uid: this.uid,
        mediakind: consumer.kind,
      });
    });
  }

  get audio() {
    return this.consumers.audio;
  }

  get video() {
    return this.consumers.video;
  }
}

export default Peer;
