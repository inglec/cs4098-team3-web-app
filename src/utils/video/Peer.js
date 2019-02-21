/*
  Events:
    -- When this user disconnects
    user-disconnect: {username}

    -- When this user adds media that we are receiving
    user-addmedia: {username, mediakind}

    -- When this user stops streaming to us or we stop receiving
    user-removemedia: {username, mediakind}

*/

class Peer {
  constructor(msPeer, room) {
    this.msPeer = msPeer;
    this.name = msPeer.name;
    this.room = room;
    this.consumers = {
      video: null,
      audio: null,
    };

    // Events that can be listened for
    this.listeners = {
      'user-disconnect': [],
      'user-addmedia': [],
      'user-removemedia': [],
    };

    // Binding
    this.onClose = this.onClose.bind(this);
    this.onNewConsumer = this.onNewConsumer.bind(this);

    // Setup event handlers
    this.msPeer.on('close', this.onClose);
    this.msPeer.on('newconsumer', this.onNewConsumer);

    // Setup all consumer for this peer
    this.msPeer.consumers.forEach(consumer => this.onNewConsumer(consumer));
  }

  audio() {
    if (this.consumers.audio) {
      return this.consumers.video.audio;
    }
    return null;
  }

  video() {
    if (this.consumers.video) {
      return this.consumers.video.track;
    }
    return null;
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

  onClose() {
    this.emit('user-disconnect', { username: this.name });
  }

  onNewConsumer(consumer) {
    // Recieve the new consumer
    consumer.receive(this.room.transports.recv)
      .then(() => {
        // Add reference to this consumer
        if (consumer.kind === 'audio') {
          this.consumers.audio = consumer;
        }
        if (consumer.kind === 'video') {
          this.consumers.video = consumer;
        }

        // Emit that new media is being consumed
        this.emit('user-addmedia', {
          username: this.name,
          mediakind: consumer.kind,
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
