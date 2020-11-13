#!/usr/bin/env node --harmony

const process = require('process');
const { spawn } = require('child_process');

const env = process.argv.slice(2);
const apiMap = {
  local: 'local',
  dev: 'dev'
};
const v8MemoryLimited = 8 * 1024;
const webpackConfigFile = '.usr/local/dev-server.js';

spawn(
  'cross-env',
  [
    `API=${apiMap[env]}`,
    `NODE_OPTIONS=\"--max-old-space-size=${v8MemoryLimited}\"`,
    `webpack-dev-server --config ${webpackConfigFile}`
  ],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  }
);
