class MediaSource {
  constructor(peer) {
    this.peer = peer;
    this.tracks = {
      video: null,
      audio: null,
    };
  }

  peer() {
    return this.peer;
  }

  owner() {
    return this.peer.name;
  }

  hasVideoTrack() {
    return this.tracks.video !== null;
  }

  hasAudioTrack() {
    return this.tracks.audio !== null;
  }

  getTracks() {
    return this.tracks;
  }

  addVideoTrack(track) {
    this.tracks.video = track;
  }

  addAudioTrack(track) {
    this.tracks.audo = track;
  }
}

export default MediaSource;
