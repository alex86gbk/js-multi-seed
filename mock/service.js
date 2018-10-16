const fs = require('fs');

const express = require('express'),
  timeout = require('connect-timeout'),
  app = express();

const API = {
  common: require('./common')
};

const PORT = '3000',
  TIME_OUT = 30 * 1e3;

app.set('port', PORT);

app.use(timeout(TIME_OUT));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// 获取列表
app.post('/api/common/getList', API.common.getList);

app.listen(app.get('port'), () => {
  console.log(`server running @ ${app.get('port')} port`);
});

