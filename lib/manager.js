'use strict';

class Channel {
  constructor() {
    this.buffer = Buffer.allocUnsafe(1000);
  }
  receiveChunk() {}
}

class ChannelManager {
  constructor() {}
  createParcel() {}
  createStream() {}
  getChannel() {
    return new Channel();
  }
}

module.exports = ChannelManager;
