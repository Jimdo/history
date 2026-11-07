'use strict';

const path = require('path');

// TEST_ENV selects which build the tests run against:
//   source (default) -> modules/index.js
//   cjs              -> cjs/@jimdo/history.js (run `npm run build` first)
//   umd              -> umd/@jimdo/history.js (run `npm run build` first)
const historyEntry = {
  source: 'modules/index.js',
  cjs: 'cjs/@jimdo/history.js',
  umd: 'umd/@jimdo/history.js'
}[process.env.TEST_ENV || 'source'];

if (!historyEntry) {
  throw new Error(`Unknown TEST_ENV "${process.env.TEST_ENV}"`);
}

module.exports = {
  testEnvironment: 'jsdom',
  testEnvironmentOptions: { url: 'http://localhost/' },
  roots: ['<rootDir>/modules'],
  testMatch: ['**/__tests__/**/*-test.js'],
  moduleNameMapper: {
    '^history$': path.resolve(__dirname, historyEntry)
  }
};
