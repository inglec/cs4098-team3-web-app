/*
  Events:
    -- When this user disconnects
    user-disconnect: {username}

    -- When this user adds media that we are receiving
    user-add-media: {username, mediakind, mediastream }

    -- When this user stops streaming to us or we stop receiving
    user-remove-media: {username, mediakind}
*/

class Peer {
  constructor(mediasoupPeer) {
    this.mediasoupPeer = mediasoupPeer;
    this.name = mediasoupPeer.name;
    this.consumers = {
      video: null,
      audio: null,
    };
    this.listeners = {
      userdisconnect: [],
      useraddmedia: [],
      userremovemedia: [],
    };

    // Binding
    this.onClose = this.onClose.bind(this);
    this.onNewConsumer = this.onNewConsumer.bind(this);

    // Setup event handlers
    this.mediasoupPeer.on('close', this.onClose);
    this.mediasoupPeer.on('newconsumer', this.onNewConsumer);

    // Setup all consumer for this peer
    this.mediasoupPeer.consumers.forEach(consumer => this.onNewConsumer(consumer));
  }

  on(eventname, callback) {
    switch (eventname) {
      case 'user-disconnect':
        this.listeners.userdisconnect.append(callback);
        break;
      case 'user-addmedia':
        this.listeners.useraddmedia.append(callback);
        break;
      case 'user-removemedia':
        this.listeners.userremovemedia.append(callback);
        break;
      default:
        console.debug('Unrecognized event for Room : ', eventname);
    }
    return this;
  }

  emit(eventname, obj) {
    this.listeners[eventname].forEach(cb => cb(obj));
  }

  onClose() {
    this.emit('user-disconnect', { username: this.name });
  }

  onNewConsumer(consumer) {
    // Recieve the new consumer
    consumer.receive(this.room.transports.recv)
      .then((track) => {
        // Create the media stream from the incoming track
        const stream = new MediaStream();
        stream.addTrack(track);

        // Add reference to this consumer
        if (consumer.kind === 'audio') {
          this.consumers.audio = consumer;
        }
        if (consumer.kind === 'video') {
          this.consumers.video = consumer;
        }

        // Emit that new media is being consumed
        this.emit('user-newmedia', {
          username: this.name,
          mediakind: consumer.kind,
          mediastream: stream,
        });
      })
      .catch((error) => {
        // TODO: Document the error a little more
        console.error(error);
      });

    consumer.on('close', (originator) => {
      console.debug(`consumer closed for ${consumer.peer.name} from ${originator}`);

      // Remove reference to this consumer
      if (consumer.kind === 'audio') {
        this.consumers.audio = null;
      }

      if (consumer.kind === 'video') {
        this.consumers.video = null;
      }

      this.emit('user-removemedia', {
        username: this.name,
        mediakind: consumer.kind,
      });
    });
  }
}

export default Peer;
