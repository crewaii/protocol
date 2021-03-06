/* eslint-disable new-cap */
'use strict';

const {
  DATA_UNIT_TYPE,

  HANDSHAKE,
  PARCEL_HEADER,
  STREAM_HEADER,
  CHUNK_HEADER,
  CHUNK_PAYLOAD,
  ACK,

  DATA_UNIT_TYPES,
  ENCODINGS,
  COMPRESSIONS,
  HANDSHAKE_STATUSES,
  HANDSHAKE_TOKEN_SIZE,
} = require('./constants');

const UInt16 = {
  size: 2,
  parse(buffer, offset = 0) {
    return buffer.readUInt16LE(offset);
  },
  serialize(value, buffer, offset = 0) {
    buffer.writeUInt16LE(value, offset);
  },
};

const UInt32 = {
  size: 4,
  parse(buffer, offset = 0) {
    return buffer.readUInt32LE(offset);
  },
  serialize(value, buffer, offset = 0) {
    buffer.writeUInt32LE(value, offset);
  },
};

const Binary = size => ({
  size,
  parse(buffer, offset = 0) {
    return buffer.slice(offset, offset + this.size);
  },
  serialize(value, buffer, offset = 0) {
    value.copy(buffer, offset);
  },
});

const Enum = values => ({
  size: 1,
  parse(buffer, offset = 0) {
    return values[buffer.readUInt8(offset)];
  },
  serialize(value, buffer, offset = 0) {
    const id = values.indexOf(value);
    buffer.writeUInt8(id, offset);
  },
});

const Struct = schemas => ({
  size: schemas.reduce((sum, schema) => sum + schema.type.size, 0),
  parse: (buffer, offset = 0) => {
    const obj = {};
    for (const { name, type } of schemas) {
      obj[name] = type.parse(buffer, offset);
      offset += type.size;
    }
    return obj;
  },
  serialize(value, buffer, offset = 0) {
    for (const { name, type } of schemas) {
      type.serialize(value[name], buffer, offset);
      offset += type.size;
    }
  },
});

module.exports = {
  [DATA_UNIT_TYPE]: Enum(DATA_UNIT_TYPES),
  [HANDSHAKE]: Struct([
    { name: 'version', type: UInt16 },
    { name: 'status', type: Enum(HANDSHAKE_STATUSES) },
    { name: 'token', type: Binary(HANDSHAKE_TOKEN_SIZE) },
  ]),
  [PARCEL_HEADER]: Struct([
    { name: 'id', type: UInt32 },
    { name: 'size', type: UInt16 },
    { name: 'compression', type: Enum(COMPRESSIONS) },
  ]),
  [STREAM_HEADER]: Struct([
    { name: 'id', type: UInt32 },
    { name: 'encoding', type: Enum(ENCODINGS) },
    { name: 'compression', type: Enum(COMPRESSIONS) },
  ]),
  [CHUNK_HEADER]: Struct([
    { name: 'channelId', type: UInt32 },
    { name: 'size', type: UInt16 },
  ]),
  [CHUNK_PAYLOAD]: Binary(),
  [ACK]: Struct([]),
};
