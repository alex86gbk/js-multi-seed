const fs = require('fs');
const path = require('path');

const Glob = require('glob').Glob;
const express = require('express');
const timeout = require('connect-timeout');
const app = express();
const stripJsonComments = require('strip-json-comments');

const { registerPid } = require('../include/registerPid');
const projectRc = require('../../.projectrc');
const { mock } = projectRc;

const globInstance = new Glob('**/*.json', {
  cwd: path.resolve(__dirname, '..', '..', 'mock'),
  sync: true,
});

const PORT = mock.port || '3000';
const PROXY_PATH = mock.proxyPath || '/api';
const TIME_OUT = 30 * 1e3;

/**
 * 发送模拟数据 JSON
 * @param req
 * @param res
 */
function sendMockJSON(req, res) {
  let reg  = new RegExp('^' + PROXY_PATH + '\/');
  let reqPath = req.path.replace(reg, '');
  let filePaths = path.resolve.apply(this, [__dirname, '..', '..', 'mock'].concat(reqPath.split('/')));
  let json = fs.readFileSync(`${filePaths}.json`).toString();

  res.send(JSON.parse(stripJsonComments(json)));
}

/**
 * 获取模拟数据 JSON
 */
function useMockJSON() {
  globInstance.found.forEach((item) => {
    let filePath = item.replace(/\.json$/, '');

    if (mock.ReverseProxy) {
      app.post(`${PROXY_PATH}/${filePath}`, sendMockJSON);
      app.get(`${PROXY_PATH}/${filePath}`, sendMockJSON);
    } else {
      app.post(`/${filePath}`, sendMockJSON);
      app.get(`/${filePath}`, sendMockJSON);
    }
  });
}

/**
 * 允许跨域
 */
function allowCrossDomain() {
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
    next();
  });
}

/**
 * 路由
 */
function routers() {
  allowCrossDomain();
  useMockJSON();
}

app.set('port', PORT);

app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

routers();

app.listen(app.get('port'), () => {
  const varPath = path.join(__dirname, '..', '..', '.var');

  registerPid(varPath, 'mock-server.pid', process.pid);
});
