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

test('should serialize data unit type', () => {
  const dataUnitTypeId = generateRandomInt(0, DATA_UNIT_TYPES.length);

  const dataUnitType = DATA_UNIT_TYPES[dataUnitTypeId];
  const type = types[DATA_UNIT_TYPE];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  expectedBuffer.writeUInt8(dataUnitTypeId);

  type.serialize(dataUnitType, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize handshake', () => {
  const statusId = generateRandomInt(0, HANDSHAKE_STATUSES.length);

  const handshake = {
    version: generateRandomUInt16(),
    status: HANDSHAKE_STATUSES[statusId],
    token: Buffer.allocUnsafe(32),
  };
  const type = types[HANDSHAKE];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  expectedBuffer.writeUInt16LE(handshake.version);
  expectedBuffer.writeUInt8(statusId, 2);
  handshake.token.copy(expectedBuffer, 3);

  type.serialize(handshake, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize parcel header', () => {
  const compressionId = generateRandomInt(0, COMPRESSIONS.length);

  const parcelHeader = {
    id: generateRandomUInt32(),
    size: generateRandomUInt16(),
    compression: COMPRESSIONS[compressionId],
  };
  const type = types[PARCEL_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  expectedBuffer.writeUInt32LE(parcelHeader.id);
  expectedBuffer.writeUInt16LE(parcelHeader.size, 4);
  expectedBuffer.writeUInt8(compressionId, 6);

  type.serialize(parcelHeader, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize stream header', () => {
  const encodingId = generateRandomInt(0, ENCODINGS.length);
  const compressionId = generateRandomInt(0, COMPRESSIONS.length);

  const streamHeader = {
    id: generateRandomUInt32(),
    encoding: ENCODINGS[encodingId],
    compression: COMPRESSIONS[compressionId],
  };
  const type = types[STREAM_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  expectedBuffer.writeUInt32LE(streamHeader.id);
  expectedBuffer.writeUInt8(encodingId, 4);
  expectedBuffer.writeUInt8(compressionId, 5);

  type.serialize(streamHeader, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize chunk header', () => {
  const chunkHeader = {
    channelId: generateRandomUInt32(),
    size: generateRandomUInt16(),
  };
  const type = types[CHUNK_HEADER];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  expectedBuffer.writeUInt32LE(chunkHeader.channelId);
  expectedBuffer.writeUInt16LE(chunkHeader.size, 4);

  type.serialize(chunkHeader, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize chunk payload', () => {
  const chunkPayload = Buffer.allocUnsafe(100);
  const type = types[CHUNK_PAYLOAD];
  type.size = chunkPayload.length;
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);
  chunkPayload.copy(expectedBuffer);

  type.serialize(chunkPayload, buffer, offset);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});

test('should serialize ack', () => {
  const ack = {};
  const type = types[ACK];
  const offset = generateRandomInt(0, buffer.length - type.size);

  const expectedBuffer = Buffer.allocUnsafe(type.size);

  type.serialize(ack, buffer);
  expect(buffer.slice(offset, offset + type.size)).toStrictEqual(
    expectedBuffer
  );
});
