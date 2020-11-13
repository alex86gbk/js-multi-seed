#!/usr/bin/env node --harmony

const process = require('process');
const { spawn } = require('child_process');

const v8MemoryLimited = 8 * 1024;
const webpackConfigFile = '.usr/local/production.js';

spawn(
  'cross-env',
  [
    'NODE_ENV=production',
    `NODE_OPTIONS=\"--max-old-space-size=${v8MemoryLimited}\"`,
    `webpack --config ${webpackConfigFile} --profile --json > stats.json`,
    '&&',
    'webpack-bundle-analyzer stats.json dist'
  ],
  {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  }
);
