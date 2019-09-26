'use strict';

class DeliveryMonitor {
  constructor() {
    this.localStoragePointer = false;
    this.remoteStoragePointer = false;
    this.counter = 0;
    this.storages = { true: [], false: [] };
  }

  sendDataUnit(buffer) {
    this.storages[this.localStoragePointer].push(buffer);
  }

  receiveDataUnit() {
    this.counter += 1;
  }

  sendAck() {
    this.localStoragePointer = !this.localStoragePointer;
    this.storages[this.localStoragePointer] = [];
  }

  receiveAck() {
    this.counter = 0;
    this.remoteStoragePointer = !this.remoteStoragePointer;
  }
}

module.exports = DeliveryMonitor;
