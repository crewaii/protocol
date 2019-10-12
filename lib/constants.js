'use strict';

const DATA_UNIT_TYPE = Symbol('data unit type');

const HANDSHAKE = Symbol('data unit type: handshake');
const PARCEL_HEADER = Symbol('data unit type: parcel header');
const STREAM_HEADER = Symbol('data unit type: stream header');
const CHUNK_HEADER = Symbol('data unit type: chunk header');
const CHUNK_PAYLOAD = Symbol('data unit type: chunk payload');
const ACK = Symbol('data unit type: ack');

const ENCODING_UTF8 = Symbol('encoding: utf-8');
const ENCODING_UTF16 = Symbol('encoding: utf-16');
const ENCODING_ASCII = Symbol('encoding: ascii');

const COMPRESSION_ZIP = Symbol('compression: zip');
const COMPRESSION_GZIP = Symbol('compression: gzip');

const HANDSHAKE_STATUS_CREATE = Symbol('hanshake status: create');
const HANDSHAKE_STATUS_RESTORE = Symbol('Hanshake status: restore');

const HANDSHAKE_TOKEN_SIZE = 32;

module.exports = {
  DATA_UNIT_TYPE,

  HANDSHAKE,
  PARCEL_HEADER,
  STREAM_HEADER,
  CHUNK_HEADER,
  CHUNK_PAYLOAD,
  ACK,

  ENCODING_UTF8,
  ENCODING_UTF16,
  ENCODING_ASCII,

  COMPRESSION_ZIP,
  COMPRESSION_GZIP,

  HANDSHAKE_STATUS_CREATE,
  HANDSHAKE_STATUS_RESTORE,
  HANDSHAKE_TOKEN_SIZE,

  ENCODINGS: [
    /* 0 */ ENCODING_UTF8,
    /* 1 */ ENCODING_UTF16,
    /* 2 */ ENCODING_ASCII,
  ],
  DATA_UNIT_TYPES: [
    /* 0 */ PARCEL_HEADER,
    /* 1 */ STREAM_HEADER,
    /* 2 */ CHUNK_HEADER,
    /* 3 */ ACK,
  ],
  HANDSHAKE_STATUSES: [
    /* 0 */ HANDSHAKE_STATUS_CREATE,
    /* 1 */ HANDSHAKE_STATUS_RESTORE,
  ],
  COMPRESSIONS: [/* 0 */ COMPRESSION_ZIP, /* 1 */ COMPRESSION_GZIP],
};
