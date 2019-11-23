'use strict';

const EventEmitter = require('events');
const types = require('./types');

class Handler extends EventEmitter {
  constructor() {
    super();
    this.name;
    this.type;
    this.offset;
    this.buffer;
  }

  set type(name) {
    this.offset = 0;
    this.name = name;
    this.type = types[name];
  }

  receiveData(buffer) {
    for (let offset = 0; offset < buffer.length; ) {
      const bytesToRead = this.type.size - this.offset;
      const slice = buffer.slice(offset, bytesToRead + offset);

      if (slice.length === this.type.size) {
        this.emit.on(this.name, this.type.parse(slice));
      } else {
        this.offset += slice.copy(this.buffer, this.offset);
        if (this.offset === this.type.size) {
          this.emit.on(this.name, this.type.parse(this.buffer));
        }
      }
      offset += slice.length;
    }
  }
}

module.exports = Handler;
