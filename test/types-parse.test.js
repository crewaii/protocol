'use strict';

const types = require('../lib/types');
const {
  DATA_UNIT_TYPE,

  HANDSHAKE,
  PARCEL_HEADER,
  STREAM_HEADER,
  CHUNK_HEADER,
  CHUNK_PAYLOAD,
  ACK,

  ENCODINGS,
  COMPRESSIONS,
  HANDSHAKE_STATUSES,
  DATA_UNIT_TYPES,
} = require('../lib/constants');

const {
  generateRandomInt,
  generateRandomUInt16,
  generateRandomUInt32,
} = require('./utils');

const buffer = Buffer.allocUnsafe(1000);

test('should parse data unit type', () => {
  const dataUnitTypeId = generateRandomInt(0, DATA_UNIT_TYPES.length);

  const dataUnitType = DATA_UNIT_TYPES[dataUnitTypeId];
  const type = types[DATA_UNIT_TYPE];
  const offset = generateRandomInt(0, buffer.length - type.size);

  buffer.writeUInt8(dataUnitTypeId, offset);
  expect(type.parse(buffer, offset)).toStrictEqual(dataUnitType);
});

test('should parse handshake', () => {
  const statusId = generateRandomInt(0, HANDSHAKE_STATUSES.length);

  const handshake = {
    version: generateRandomUInt16(),
    status: HANDSHAKE_STATUSES[statusId],
    token: Buffer.allocUnsafe(32),
  };
  const type = types[HANDSHAKE];
  const offset = generateRandomInt(0, buffer.length - type.size);

  buffer.writeUInt16LE(handshake.version, offset);
  buffer.writeUInt8(statusId, offset + 2);
  handshake.token.copy(buffer, offset + 3);
  expect(type.parse(buffer, offset)).toStrictEqual(handshake);
});

test('should parse parcel header', () => {
  const compressionId = generateRandomInt(0, COMPRESSIONS.length);

  const parcelHeader = {
    id: generateRandomUInt32(),
    size: generateRandomUInt16(),
    compression: COMPRESSIONS[compressionId],
  };
  const type = types[PARCEL_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  buffer.writeUInt32LE(parcelHeader.id, offset);
  buffer.writeUInt16LE(parcelHeader.size, offset + 4);
  buffer.writeUInt8(compressionId, offset + 6);
  expect(type.parse(buffer, offset)).toStrictEqual(parcelHeader);
});

test('should parse stream header', () => {
  const encodingId = generateRandomInt(0, ENCODINGS.length);
  const compressionId = generateRandomInt(0, COMPRESSIONS.length);

  const streamHeader = {
    id: generateRandomUInt32(),
    encoding: ENCODINGS[encodingId],
    compression: COMPRESSIONS[compressionId],
  };
  const type = types[STREAM_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  buffer.writeUInt32LE(streamHeader.id, offset);
  buffer.writeUInt8(encodingId, offset + 4);
  buffer.writeUInt8(compressionId, offset + 5);
  expect(type.parse(buffer, offset)).toStrictEqual(streamHeader);
});

test('should parse chunk header', () => {
  const chunkHeader = {
    channelId: generateRandomUInt32(),
    size: generateRandomUInt16(),
  };
  const type = types[CHUNK_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  buffer.writeUInt32LE(chunkHeader.channelId, offset);
  buffer.writeUInt16LE(chunkHeader.size, offset + 4);
  expect(type.parse(buffer, offset)).toStrictEqual(chunkHeader);
});

test('should parse chunk payload', () => {
  const chunkPayload = Buffer.allocUnsafe(100);
  const type = types[CHUNK_PAYLOAD];
  type.size = chunkPayload.length;
  const offset = generateRandomInt(0, buffer.length - type.size);

  chunkPayload.copy(buffer, offset);
  expect(type.parse(buffer, offset)).toStrictEqual(chunkPayload);
});

test('should parse ack', () => {
  const ack = {};
  const type = types[ACK];
  const offset = generateRandomInt(0, buffer.length - type.size);

  expect(type.parse(buffer, offset)).toStrictEqual(ack);
});
