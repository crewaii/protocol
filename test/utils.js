'use strict';

const generateRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const generateRandomUInt16 = () => generateRandomInt(0, 2 ** 16);
const generateRandomUInt32 = () => generateRandomInt(0, 2 ** 32);

module.exports = {
  generateRandomInt,
  generateRandomUInt16,
  generateRandomUInt32,
};
