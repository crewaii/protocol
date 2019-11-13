'use strict';

const {
  DATA_UNIT_TYPE,
  PARCEL_HEADER,
  STREAM_HEADER,
  CHUNK_HEADER,
  CHUNK_PAYLOAD,
  ACK,
} = require('./constants');

class Connection {
  constructor(transport, handler) {
    this.transport = transport;

    handler.on(DATA_UNIT_TYPE, dataUnitType => {
      handler.type = dataUnitType;
    });

    handler.on(PARCEL_HEADER, () => {
      handler.type = DATA_UNIT_TYPE;
    });

    handler.on(STREAM_HEADER, () => {
      handler.type = DATA_UNIT_TYPE;
    });

    handler.on(CHUNK_HEADER, chunk => {
      handler.type = CHUNK_PAYLOAD;
      handler.type.size = chunk.size;

      handler.once(CHUNK_PAYLOAD, payload => {
        chunk.payload = payload;
        handler.type = DATA_UNIT_TYPE;
      });
    });

    handler.on(ACK, () => {
      handler.type = DATA_UNIT_TYPE;
    });

    this.transport.on('data', handler.receiveData);
  }
}

module.exports = Connection;
