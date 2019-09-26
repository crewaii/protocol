'use strict';

const ChannelManager = require('./manager');
const DeliveryMonitor = require('./monitor');
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
    this.deliveryMonitor = new DeliveryMonitor();
    this.channelManager = new ChannelManager();

    handler.on(DATA_UNIT_TYPE, dataUnitType => {
      handler.type = dataUnitType;
    });

    handler.on(PARCEL_HEADER, parcelHeader => {
      this.deliveryMonitor.recieveStruct();
      this.channelManager.createParcel(parcelHeader);
      handler.type = DATA_UNIT_TYPE;
    });

    handler.on(STREAM_HEADER, streamHeader => {
      this.deliveryMonitor.recieveStruct();
      this.channelManager.createStream(streamHeader);
      handler.type = DATA_UNIT_TYPE;
    });

    handler.on(CHUNK_HEADER, chunk => {
      handler.type = CHUNK_PAYLOAD;
      handler.schema.size = chunk.size;

      handler.once(CHUNK_PAYLOAD, payload => {
        chunk.payload = payload;
        this.deliveryMonitor.recieveStruct();
        this.channelManager.receiveChunk(chunk);
        handler.type = DATA_UNIT_TYPE;
      });
    });

    handler.on(ACK, ack => {
      this.deliveryMonitor.receiveAck(ack);
      handler.type = DATA_UNIT_TYPE;
    });

    this.transport.on('data', handler.receiveData);
  }
}

module.exports = Connection;
