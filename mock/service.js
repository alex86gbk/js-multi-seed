const fs = require('fs');
const path = require('path');

const express = require('express');
const timeout = require('connect-timeout');
const app = express();

const { registerPid } = require('../config/register');
const { port, proxyPath } = require('../.projectrc').mock;

const PORT = port || '3000';
const PROXY_PATH = proxyPath || '/api';
const TIME_OUT = 30 * 1e3;

const mock = {
  common: require('./common'),
};

app.set('port', PORT);

app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// 获取列表
app.post(`${PROXY_PATH}/common/getList`, mock.common.getList);

app.listen(app.get('port'), () => {
  registerPid(path.resolve(__dirname, '..', 'config', 'mock-server.pid'), process.pid);
});
